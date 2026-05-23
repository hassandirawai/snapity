import type { InferSelectModel } from 'drizzle-orm'
import { comment, notification, post, user } from '~~/server/db/schema'

export interface NotificationDataType {
  id: string
  issuer: {
    id: string
    username: string
    fullName: string
    avatar: string | null
  }
  post: {
    id: string
    content: string
  } | null
  comment: {
    id: string
    content: string
  } | null
  type: InferSelectModel<typeof notification>['type']
  isRead: boolean
  createdAt: Date
}

export function notificationDataSelect() {
  return {
    id: notification.id,
    issuer: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
    },
    post: {
      id: post.id,
      content: post.content,
    },
    comment: {
      id: comment.id,
      content: comment.content,
    },
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  }
}

export interface NotificationsPageType {
  notificationsData: NotificationDataType[]
  nextCursor: Date | null
}

export interface NotificationsCountInfoType {
  unreadCount: number
}
