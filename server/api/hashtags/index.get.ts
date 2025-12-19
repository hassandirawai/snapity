import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  try {
    const hashtags = await useDrizzle()
      .select({
        id: tables.hashtags.id,
        tag: tables.hashtags.tag,
        postsCount: sql<number>`COUNT(${tables.postHashtags.postId})`.as('postsCount'),
      })
      .from(tables.hashtags)
      .innerJoin(tables.postHashtags, eq(tables.hashtags.id, tables.postHashtags.hashtagId))
      .groupBy(tables.hashtags.id)
      .orderBy(sql`COUNT(${tables.postHashtags.postId}) DESC`)

    if (!hashtags.length) {
      throw createError({
        statusCode: 404,
        message: 'No hashtags found',
      })
    }

    return hashtags
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
