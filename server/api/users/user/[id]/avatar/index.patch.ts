import { eq } from 'drizzle-orm'
import { blob } from 'hub:blob'
import { user } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = useDrizzle()

  // Get old avatar from DB to delete blob correctly
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  })

  if (currentUser?.avatar) {
    const oldBlobPath = currentUser.avatar
    blob.del(oldBlobPath)
  }

  const uploadedFiles = await blob.handleUpload(event, {
    formKey: 'avatar',
    multiple: false,
    ensure: {
      maxSize: '2MB',
      types: ['image/webp'],
    },
    put: {
      prefix: `avatars/${session.user.id}`,
      addRandomSuffix: true,
      contentType: 'image/webp',
    },
  })

  if (!uploadedFiles) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded',
    })
  }

  console.warn(uploadedFiles)

  const filePathname = uploadedFiles[0].pathname

  await setUserSession(event, {
    ...session,
    user: { ...session.user, avatar: filePathname },
  })

  await db.update(user)
    .set({ avatar: filePathname })
    .where(eq(user.id, session.user.id))

  return { avatar: filePathname }
})
