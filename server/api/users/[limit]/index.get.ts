import { getUsers } from '~~/server/utils/queries'

export default defineEventHandler(async (event) => {
  const queryLimit = getRouterParam(event, 'limit') as number | undefined

  const { user: loggedInUser } = await requireUserSession(event)

  return await getUsers({
    limit: queryLimit,
    loggedInUserId: loggedInUser.id,
  })
})
