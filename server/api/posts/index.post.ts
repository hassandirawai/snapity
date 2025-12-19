import type { CreatePostSchemaType } from '~/utils/zod-schemas'
import { eq } from 'drizzle-orm'
import { createPostSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated
    const user = await requiredUser(event)

    // Get post data
    const body: CreatePostSchemaType = await readBody(event)

    // Validate post data
    const parsed = createPostSchema.safeParse(body)

    if (!parsed.success) {
      return {
        statusCode: 400,
        statusMessage: parsed.error.issues[0].message,
      }
    }

    // Create post
    const createdPosts = await useDrizzle()
      .insert(tables.posts)
      .values({
        content: parsed.data.content,
        authorId: user.id,
      })
      .returning()

    // Extract hashtags from post
    const postHashtags = extractHashtags(parsed.data.content)

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
        .insert(tables.postHashtags)
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
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
