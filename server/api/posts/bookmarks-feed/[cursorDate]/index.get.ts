import { getBookmarksFeedPosts } from '~~/server/utils/queries'

export default defineEventHandler(async (event) => {
  const cursorDateParam = getRouterParam(event, 'cursorDate')
  const cursorDate = cursorDateParam ? new Date(cursorDateParam) : undefined
  const pageSize = 5

  const { user: loggedInUser } = await requireUserSession(event)

  // console.log(cursorDate)

  // await new Promise(r => setTimeout(r, 2000))

  const postData = await getBookmarksFeedPosts({
    userId: loggedInUser.id,
    pageSize,
    cursorDate,
  })

  const postPage: PostPageType = {
    postsData: postData.slice(0, pageSize),
    nextCursor: postData.length > pageSize ? postData[pageSize].post.createdAt : null,
  }

  return postPage
})
