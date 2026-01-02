import type { UserProfile } from '~~/shared/types/users'
import { desc, eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    await requireUserSession(event)

    const username = getRouterParam(event, 'username') as string | undefined

    if (!username) {
      throw createError({
        statusCode: 400,
        message: 'Username is required',
      })
    }

    const db = useDrizzle()

    const users = await db
      .select({
        id: tables.user.id,
        avatar: tables.user.image,
        username: tables.user.username,
        email: tables.user.email,
        fullName: tables.user.fullName,
        createdAt: tables.user.createdAt,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${tables.user.id} = ${tables.follows.followingId} THEN ${tables.follows.followerId} END)`,
        followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${tables.user.id} = ${tables.follows.followingId} THEN 1 END)`,
        postsCount: sql<number>`COUNT(${tables.posts.id})`,
      })
      .from(tables.user)
      .leftJoin(tables.follows, eq(tables.user.id, tables.follows.followingId))
      .leftJoin(tables.posts, eq(tables.user.id, tables.posts.authorId))
      .where(
        eq(tables.user.username, username),
      )
      .groupBy(tables.user.id)
      .orderBy(desc(tables.user.id))

    const userData: UserProfile | undefined = users[0]

    if (!userData) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    return userData
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
