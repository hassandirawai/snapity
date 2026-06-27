import { getUserPosts } from '~~/server/utils/queries'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await getUserSession(event)

  const userId = getRouterParam(event, 'id') as string | undefined

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required',
    })
  }
  const cursorDateParam = getRouterParam(event, 'cursorDate')
  const cursorDate = cursorDateParam ? new Date(cursorDateParam) : undefined
  const pageSize = 5

  // console.log(cursorDate)

  // await new Promise(r => setTimeout(r, 2000))

  const postData = await getUserPosts({
    loggedInUserId: loggedInUser?.id,
    userId,
    pageSize,
    cursorDate,
  })

  const postPage: PostsPageType = {
    postsData: postData.slice(0, pageSize),
    nextCursor: postData.length > pageSize ? postData[pageSize - 1].post.createdAt : null,
  }

  return postPage
})
