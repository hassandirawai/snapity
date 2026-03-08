import { media } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const db = useDrizzle()

  const uploadedFiels = await blob.handleMultipartUpload(event, {
    prefix: 'posts',
    addRandomSuffix: true,
    contentType: 'image/jpeg',
  })

  if (uploadedFiels.action === 'complete') {
    console.warn('complete', uploadedFiels.data.url)
    const { url, contentType, pathname } = uploadedFiels.data

    if (url) {
      const createdMedia = await db
        .insert(media)
        .values({
          url,
          pathname,
          type: contentType?.startsWith('video/') ? 'video' : 'image',
          uploadedById: loggedInUser.id,
        })
        .returning()

      if (!createdMedia) {
        throw createError({
          statusCode: 400,
          message: 'File has not been created',
        })
      }

      return { mediaId: createdMedia[0].id }
    }
  }
})
