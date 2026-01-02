export default defineEventHandler(async (event) => {
  try {
    await requireUserSession(event)

    const postId = getRouterParam(event, 'id') as string || undefined

    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Post ID is required',
      })
    }

    return await getPostById(postId)
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
