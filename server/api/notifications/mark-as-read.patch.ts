import { and, eq } from 'drizzle-orm'
import { notification } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const db = useDrizzle()
  const result = await db
    .update(notification)
    .set({ isRead: true })
    .where(
      and(
        eq(notification.isRead, false),
        eq(notification.recipientId, loggedInUser.id),
      ),
    )

  return { success: !!result.rowCount }
})
