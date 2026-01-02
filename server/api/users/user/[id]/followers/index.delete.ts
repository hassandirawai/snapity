import { and, eq } from 'drizzle-orm'
import { follows } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    const { user: loggedInUser } = await requireUserSession(event)

    const followingId = getRouterParam(event, 'id') as string | undefined

    if (!followingId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required',
      })
    }

    return await useDrizzle()
      .delete(follows)
      .where(and(eq(follows.followerId, loggedInUser.id), eq(follows.followingId, followingId)))
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
