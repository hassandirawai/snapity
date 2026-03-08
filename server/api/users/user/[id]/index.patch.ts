import { eq } from 'drizzle-orm'
import { user } from '~~/server/db/schema'
import { updateUserDataSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  const { fullName, bio } = await readValidatedBody(event, body => updateUserDataSchema.parse(body))

  const { user: loggenInUser } = await requireUserSession(event)

  const db = useDrizzle()

  await db
    .update(user)
    .set({
      fullName,
      bio,
      updatedAt: new Date(),
    })
    .where(eq(user.id, loggenInUser.id))

  const updatedUserData = await findUserById(loggenInUser.id)

  if (!updatedUserData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return updatedUserData
})
