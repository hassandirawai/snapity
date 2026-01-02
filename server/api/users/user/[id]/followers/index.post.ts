import { follows } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    const { user: loggedInUser } = await requireUserSession(event)

    const followerId = loggedInUser.id
    const followingId = getRouterParam(event, 'id') as string | undefined

    if (!followingId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required',
      })
    }

    if (followerId === followingId) {
      throw createError({
        statusCode: 400,
        message: 'You cannot follow yourself',
      })
    }

    await useDrizzle()
      .insert(follows)
      .values({
        followerId,
        followingId,
      })
      .onConflictDoNothing()

    return {
      followerId,
      followingId,
    }
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
