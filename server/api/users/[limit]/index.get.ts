import { and, desc, eq, ne, notExists, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const queryLimit = getRouterParam(event, 'limit')

    const loggedInUser = await requiredUser(event)

    const db = useDrizzle()

    const users = await db
      .select({
        id: tables.user.id,
        avatar: tables.user.image,
        username: tables.user.username,
        name: tables.user.name,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${tables.user.id} = ${tables.follows.followingId} THEN ${tables.follows.followerId} END)`,
      })
      .from(tables.user)
      .leftJoin(tables.follows, eq(tables.user.id, tables.follows.followingId))
      .where(
        and(
          ne(tables.user.id, loggedInUser.id),
          notExists(
            db
              .select()
              .from(tables.follows)
              .where(
                and(
                  eq(tables.follows.followingId, tables.user.id),
                  eq(tables.follows.followerId, loggedInUser.id),
                ),
              ),
          ),
        ),
      )
      .groupBy(tables.user.id)
      .orderBy(desc(tables.user.id))
      .limit(Number(queryLimit))

    if (!users.length) {
      throw createError({
        statusCode: 404,
        message: 'No users found',
      })
    }

    return users
  }
  catch (error) {
    console.log(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
