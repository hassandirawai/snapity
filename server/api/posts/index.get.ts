export default defineEventHandler(async (event) => {
  try {
    await requiredUser(event)

    return await getPosts()
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
