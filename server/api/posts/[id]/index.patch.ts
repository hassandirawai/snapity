import { and, eq } from 'drizzle-orm'
import { createPostSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUserSession(event)
    const postId = getRouterParam(event, 'id') as string
    const { data: post } = createPostSchema.safeParse(await readBody(event))

    const updatedPost = await useDrizzle()
      .update(tables.post)
      .set({
        content: post?.content,
      })
      .where(and(eq(tables.post.id, postId), eq(tables.post.authorId, user.id)))
      .returning({
        updatedContent: tables.post.content,
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
