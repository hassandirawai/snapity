import type { CreatePostSchemaType } from '~/utils/zod-schemas'
import { and, eq, inArray } from 'drizzle-orm'
import { hashtag, media, mention, notification, postHashtag, user } from '~~/server/db/schema'
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
      statusMessage: parseError.issues[0]?.message,
    }
  }

  const db = useDrizzle()

  // Create post
  const createdPosts = await db
    .insert(tables.post)
    .values({
      content: parsedData.postContent,
      authorId: loggedInUser.id,
    })
    .returning()

  const createdPost = createdPosts[0]

  if (!createdPost) {
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
        postId: createdPost.id,
      })
      .where(
        and(
          inArray(media.id, parsedData.mediaIds),
          eq(media.uploadedById, loggedInUser.id),
        ),
      )
  }

  // Extract mentions from post
  const postUsersMention = extractMentionedUsers(createdPost.content)
  const mentionedUsersIds = [...new Set(postUsersMention)]
    .filter(id => id !== loggedInUser.id)

  const mentionedUsers = await db
    .select()
    .from(user)
    .where(
      inArray(user.id, mentionedUsersIds),
    )

  if (mentionedUsers.length) {
    const mentionData = await db
      .insert(mention)
      .values(
        mentionedUsers.map(user => ({
          issuerId: loggedInUser.id,
          mentionedUserId: user.id,
          postId: createdPost.id,
        })),
      )
      .returning()

    if (mentionData.length) {
      await db
        .insert(notification)
        .values(
          mentionData.map(mention => ({
            issuerId: loggedInUser.id,
            recipientId: mention.mentionedUserId,
            postId: createdPost.id,
            mentionId: mention.id,
            type: 'MENTION' as const,
          })),
        )
    }
  }

  // Extract hashtags from post
  const postHashtags = extractHashtags(parsedData.postContent)

  // Insert hashtags into hashtag table (create if not exist)
  let hashtagRecords: typeof hashtag.$inferSelect[] = []
  if (postHashtags.length) {
    const existingHashtags = await db
      .select()
      .from(hashtag)
      .where(
        inArray(
          hashtag.tag,
          postHashtags,
        ),
      )

    const existingTags = new Set(
      existingHashtags.map(hashtag => hashtag.tag),
    )

    const newTags = postHashtags.filter(tag => !existingTags.has(tag))

    const newCreatedHastags = newTags.length
      ? await db
          .insert(hashtag)
          .values(newTags.map(tag => ({ tag })))
          .onConflictDoNothing()
          .returning()
      : []

    hashtagRecords = [
      ...existingHashtags,
      ...newCreatedHastags,
    ]
  }

  // Adding post and hashtag data to post_hashtags table
  if (hashtagRecords.length) {
    await db
      .insert(postHashtag)
      .values(hashtagRecords.map(hashtag => ({
        postId: createdPost.id,
        hashtagId: hashtag.id,
      })))
  }

  // Get created post data with reactions and hashtags
  const postData = await getPostById(createdPost.id)

  if (!postData) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  return postData
})
