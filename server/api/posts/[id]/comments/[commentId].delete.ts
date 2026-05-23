import { and, eq } from 'drizzle-orm'
import { comment, notification } from '~~/server/db/schema'
import { getCommentById } from '~~/server/utils/queries'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const commentId = getRouterParam(event, 'commentId') as string

  if (!commentId) {
    throw createError({ statusCode: 400, message: 'commentId is required' })
  }

  const commentData = await getCommentById(commentId)

  if (commentData.user.id !== loggedInUser.id) {
    throw createError({ statusCode: 403, message: 'You are not authorized to delete this comment' })
  }

  const postData = await getPostById(commentData.comment.postId)

  const db = useDrizzle()

  const result = await db
    .delete(comment)
    .where(eq(comment.id, commentId))
    .returning()

  await db
    .delete(notification)
    .where(
      and(
        eq(notification.postId, result[0].postId),
        eq(notification.issuerId, loggedInUser.id),
        eq(notification.recipientId, postData.user.id),
        eq(notification.commentId, commentId),
      ),
    )

  if (!result[0]) {
    throw createError({ statusCode: 404, message: 'Unexpected error occurred' })
  }

  return commentData
})
