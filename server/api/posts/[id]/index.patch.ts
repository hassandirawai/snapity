import { and, eq } from 'drizzle-orm'
import { createPostSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  try {
    const user = await requiredUser(event)
    const postId = getRouterParam(event, 'id') as string
    const { data: post } = createPostSchema.safeParse(await readBody(event))

    const updatedPost = await useDrizzle()
      .update(tables.posts)
      .set({
        content: post?.content,
      })
      .where(and(eq(tables.posts.id, postId), eq(tables.posts.authorId, user.id)))
      .returning({
        updatedContent: tables.posts.content,
      })

    return updatedPost[0]
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
