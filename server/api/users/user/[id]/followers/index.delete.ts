import { and, eq } from 'drizzle-orm'
import { follows, notification } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const followingId = getRouterParam(event, 'id') as string | undefined

  if (!followingId) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required',
    })
  }

  const db = useDrizzle()

  const result = await db
    .delete(follows)
    .where(and(eq(follows.followerId, loggedInUser.id), eq(follows.followingId, followingId)))

  await db
    .delete(notification)
    .where(
      and(
        eq(notification.issuerId, loggedInUser.id),
        eq(notification.recipientId, followingId),
        eq(notification.type, 'FOLLOW'),
      ),
    )

  return { deleted: !!result.rowCount }
})
