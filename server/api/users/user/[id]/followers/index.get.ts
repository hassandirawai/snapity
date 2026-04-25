import type { FollowerInfo } from '~~/shared/types/user'
import { desc, eq, sql } from 'drizzle-orm'
import { follows, user } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id') as string | undefined

  const { user: loggedInUser } = await requireUserSession(event)

  if (!userId) {
    throw createError('User ID is required')
  }

  const usersData = await useDrizzle()
    .select({
      followersCount: sql<number>`COUNT(${follows.followerId})::int`.as('followers_count'),
      isFollowedByUser: sql<boolean>`BOOL_OR(${follows.followerId} = ${loggedInUser.id})`.as('is_followed_by_user'),
    })
    .from(tables.user)
    .leftJoin(follows, eq(user.id, follows.followingId))
    .where(eq(user.id, userId))
    .groupBy(user.id)
    .orderBy(desc(user.fullName))

  if (!usersData[0]) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  console.error(typeof usersData[0].followersCount)

  const followerInfoData: FollowerInfo = {
    followersCount: usersData[0].followersCount,
    isFollowedByUser: usersData[0].isFollowedByUser,
  }

  return followerInfoData
})
