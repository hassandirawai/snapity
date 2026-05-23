import { getCommentsFeed } from '~~/server/utils/queries'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  // await new Promise(r => setTimeout(r, 16000))

  const params = getRouterParams(event)

  const cursorDate = params.cursorDate ? new Date(params.cursorDate) : undefined
  const pageSize = 5

  const commentsData = await getCommentsFeed({
    pageSize,
    cursorDate,
    loggedInUserId: loggedInUser.id,
    postId: params.id,
  })

  const commentsPage: CommentsPageType = {
    commentsData: commentsData.slice(0, pageSize),
    nextCursor: commentsData.length > pageSize ? commentsData[pageSize - 1].comment.createdAt : null,
  }

  return commentsPage
})
