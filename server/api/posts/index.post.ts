import type { CreatePostSchemaType } from '~/utils/zod-schemas'
import { and, eq, inArray } from 'drizzle-orm'
import { media, mention, notification, user } from '~~/server/db/schema'
import { createPostSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  const { user: loggedInUser } = await requireUserSession(event)

  // Get post data
  const body: CreatePostSchemaType = await readBody(event)

  // Validate post data
  const { success: isParsed, data: parsedData, error: parseError } = createPostSchema.safeParse(body)

  // console.warn('createPostSchema.safeParse:', parseError)

  if (!isParsed) {
    return {
      statusCode: 400,
      statusMessage: parseError.issues[0].message,
    }
  }

  const db = useDrizzle()

  // Create post
  const createdPosts = await db
    .insert(tables.post)
    .values({
      content: parsedData.content,
      authorId: loggedInUser.id,
    })
    .returning()

  if (!createdPosts) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create post',
    })
  }

  // Link uploaded media to the new post
  if (parsedData.mediaIds.length) {
    await db
      .update(media)
      .set({
        postId: createdPosts[0].id,
      })
      .where(
        and(
          inArray(media.id, parsedData.mediaIds),
          eq(media.uploadedById, loggedInUser.id),
        ),
      )
  }

  // Extract mentions from post
  const postUsersMention = extractMentionedUsers(createdPosts[0].content)
  const usernames = [...new Set(postUsersMention?.map(mention => mention.slice(1)))]

  const mentionedUsers = await db
    .select()
    .from(user)
    .where(
      inArray(user.username, usernames ?? []),
    )

  if (mentionedUsers.length) {
    const mentionData = await db
      .insert(mention)
      .values(
        mentionedUsers.map(user => ({
          issuerId: loggedInUser.id,
          mentionedUserId: user.id,
          postId: createdPosts[0].id,
        })),
      )
      .returning()

    await db
      .insert(notification)
      .values(
        mentionedUsers.map((user, index) => ({
          issuerId: loggedInUser.id,
          recipientId: user.id,
          postId: createdPosts[0].id,
          mentionId: mentionData[index].id,
          type: 'MENTION' as const,
        })),
      )
  }

  // Extract hashtags from post
  const postHashtags = extractHashtags(parsedData.content)

  // Insert hashtags into hashtag table (create if not exist)
  let hashtagRecords = null
  if (postHashtags) {
    hashtagRecords = await Promise.all(
      postHashtags.map(async (hashtag) => {
        // Check if hashtag already exists in DB
        const [existing] = await useDrizzle()
          .select()
          .from(tables.hashtags)
          .where(eq(tables.hashtags.tag, hashtag))

        // If hashtag exists, return it
        if (existing)
          return existing

        // If hashtag doesn't exist, create it
        const [inserted] = await useDrizzle()
          .insert(tables.hashtags)
          .values({ tag: hashtag })
          .returning()

        // Return created hashtags
        return inserted
      }),
    )
  }

  // Adding post and hashtag data to post_hashtags table
  if (hashtagRecords) {
    await useDrizzle()
      .insert(tables.postHashtag)
      .values(hashtagRecords.map(hashtag => ({
        postId: createdPosts[0].id,
        hashtagId: hashtag.id,
      })))
  }

  // Get created post data with reactions and hashtags
  const post = await getPostById(createdPosts[0].id)

  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  return post
})
