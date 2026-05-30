import type { JSONContent } from '@tiptap/core'
import { eq, inArray } from 'drizzle-orm'
import { comment, mention, notification, user } from '~~/server/db/schema'
import { createCommentSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const postId = getRouterParam(event, 'id') as string

  const { commentContent }: { commentContent: JSONContent } = await readBody(event)

  const { data: parsedCommentContent, success: isParsed, error: parseError } = createCommentSchema.safeParse(commentContent)

  if (!isParsed) {
    return {
      statusCode: 400,
      statusMessage: parseError.issues[0].message,
    }
  }

  const postData = await getPostById(postId)

  const db = useDrizzle()

  const createdComment = await db
    .insert(comment)
    .values({
      postId: postData.post.id,
      content: parsedCommentContent,
      userId: loggedInUser.id,
    })
    .returning()

  if (loggedInUser.id !== postData.user.id) {
    await db
      .insert(notification)
      .values({
        issuerId: loggedInUser.id,
        recipientId: postData.user.id,
        postId: postData.post.id,
        commentId: createdComment[0].id,
        type: 'COMMENT',
      })

    // Extract mentions from comment
    const postUsersMention = extractMentionedUsers(createdComment[0].content)
    const mentionedUsersIds = [...new Set(postUsersMention)]
      .filter(id => id !== loggedInUser.id)

    const mentionedUsers = await db
      .select()
      .from(user)
      .where(
        inArray(user.id, mentionedUsersIds),
      )

    if (mentionedUsers.length) {
      const mentionData = await db
        .insert(mention)
        .values(
          mentionedUsers.map(user => ({
            issuerId: loggedInUser.id,
            mentionedUserId: user.id,
            postId: postData.post.id,
            commentId: createdComment[0].id,
          })),
        )
        .returning()

      await db
        .insert(notification)
        .values(
          mentionedUsers.map((user, index) => ({
            issuerId: loggedInUser.id,
            recipientId: user.id,
            postId: postData.post.id,
            commentId: createdComment[0].id,
            mentionId: mentionData[index].id,
            type: 'MENTION' as const,
          })),
        )
    }
  }

  const commentsData: CommentDataType[] = await db
    .select(commentDataSelect(loggedInUser.id))
    .from(comment)
    .innerJoin(user, eq(user.id, comment.userId))
    .where(eq(comment.id, createdComment[0].id))

  return commentsData[0]
})
