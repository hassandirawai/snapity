import { and, count, eq } from 'drizzle-orm'
import { notification } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const db = useDrizzle()

  const unreadNotifications = await db
    .select({
      count: count(notification.recipientId),
    })
    .from(notification)
    .where(
      and(
        eq(notification.recipientId, loggedInUser.id),
        eq(notification.isRead, false),
      ),
    )

  const notificationsCountInfo: NotificationsCountInfoType = {
    unreadCount: unreadNotifications[0].count ?? 0,
  }

  return notificationsCountInfo
})
