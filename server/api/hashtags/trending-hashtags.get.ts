import { eq, sql } from 'drizzle-orm'
import { hashtag, postHashtag } from '~~/server/db/schema'

export default defineEventHandler(async (_event) => {
  const hashtags = await useDrizzle()
    .select({
      id: hashtag.id,
      tag: hashtag.tag,
      postsCount: sql<number>`COUNT(${postHashtag.postId})`.as('postsCount'),
    })
    .from(hashtag)
    .innerJoin(postHashtag, eq(hashtag.id, postHashtag.hashtagId))
    .groupBy(hashtag.id)
    .orderBy(sql`COUNT(${postHashtag.postId}) DESC`)
    .limit(5)

  return hashtags
})
