export default defineEventHandler(async (event) => {
  // console.log('Post API called, headers:', event.headers.get('cookie'))
  await requireUserSession(event)

  const postId = getRouterParam(event, 'id') as string || undefined

  if (!postId) {
    throw createError({
      statusCode: 400,
      message: 'Post ID is required',
    })
  }

  return await getPostById(postId)
})
