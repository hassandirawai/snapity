import type { FollowerInfo } from '~~/shared/types/users'
import { desc, eq, or, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id') as string | undefined

    const loggedInUser = await requiredUser(event)

    if (!userId) {
      throw createError('User ID is required')
    }

    const users = await useDrizzle()
      .select({
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${tables.user.id} = ${tables.follows.followingId} THEN ${tables.follows.followerId} END)`,
        isFollowedByUser: sql<boolean>`BOOL_OR(${tables.user.id} = ${tables.follows.followingId} AND ${tables.follows.followerId} = ${loggedInUser.id})`,
      })
      .from(tables.user)
      .leftJoin(tables.follows, or(eq(tables.user.id, tables.follows.followerId), eq(tables.user.id, tables.follows.followingId)))
      .where(eq(tables.user.id, userId))
      .groupBy(tables.user.id)
      .orderBy(desc(tables.user.name))

    if (!users[0]) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    const data: FollowerInfo = {
      followers: users[0].followers.length,
      isFollowedByUser: users[0].isFollowedByUser,
    }

    return data
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
