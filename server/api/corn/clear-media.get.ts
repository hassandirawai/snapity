import { and, inArray, isNull, lt } from 'drizzle-orm'
import { media } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')

  if (authHeader !== `Bearar ${process.env.CORN_SECRET}`) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const db = useDrizzle()
  const mediaData = await db
    .select()
    .from(media)
    .where(
      and(
        isNull(media.postId),
        lt(media.createdAt, new Date(Date.now() - 1000 * 60 * 60 * 24)),
      ),
    )

  if (!mediaData) {
    throw createError({
      statusCode: 404,
      message: 'No media found',
    })
  }

  mediaData.forEach(async (item) => {
    await blob.delete(item.pathname)
  })

  await db
    .delete(media)
    .where(inArray(media.id, mediaData.map(item => item.id)))

  return {
    success: mediaData,
  }
})
