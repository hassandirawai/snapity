import { desc, eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'id') as string | undefined

    await requireUserSession(event)

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required',
      })
    }

    const db = useDrizzle()

    const users = await db
      .select({
        id: tables.user.id,
        avatar: tables.user.image,
        username: tables.user.username,
        fullName: tables.user.fullName,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${tables.user.id} = ${tables.follows.followingId} THEN ${tables.follows.followerId} END)`,
      })
      .from(tables.user)
      .leftJoin(tables.follows, eq(tables.user.id, tables.follows.followingId))
      .where(
        eq(tables.user.id, userId),
      )
      .groupBy(tables.user.id)
      .orderBy(desc(tables.user.id))

    if (!users[0]) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    return users[0]
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
