import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const { user: loggedInUser } = await requireUserSession(event)

    const postId = getRouterParam(event, 'id') as string || undefined

    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Post ID is required',
      })
    }

    const postDate = await getPostById(postId)

    if (postDate.authorId !== loggedInUser.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You are not authorized to delete this post',
      })
    }

    await useDrizzle()
      .delete(tables.posts)
      .where(eq(tables.posts.id, postDate.id))

    return postDate
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
