export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const username = getRouterParam(event, 'username') as string | undefined

  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Username is required',
    })
  }

  const users = await findUserByUsername(username)

  const userData: UserDataType = users

  if (!userData) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  return userData
})
