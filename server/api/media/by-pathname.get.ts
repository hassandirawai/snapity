import { eq } from 'drizzle-orm'
import { media } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { pathname } = getQuery(event)

  if (!pathname) {
    throw createError({ statusCode: 400, statusMessage: 'Missing pathname' })
  }

  const db = useDrizzle()

  const reultsData = await db
    .select({
      id: media.id,
    })
    .from(media)
    .where(eq(media.pathname, pathname as string))

  if (!reultsData.length) {
    throw createError({ statusCode: 404, statusMessage: 'Media not found' })
  }

  return { mediaId: reultsData[0].id }
})
