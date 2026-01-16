import { getForYouFeedPosts } from '~~/server/utils/queries'

export default defineEventHandler(async (event) => {
  try {
    const cursorDateParam = getRouterParam(event, 'cursorDate')
    const cursorDate = cursorDateParam ? new Date(cursorDateParam) : undefined
    const pageSize = 5

    await requireUserSession(event)

    // console.log(cursorDate)

    await new Promise(r => setTimeout(r, 2000))

    const postData = await getForYouFeedPosts({
      pageSize,
      cursorDate,
    })

    const postPage: PostPageType = {
      posts: postData.slice(0, pageSize),
      nextCursor: postData.length > pageSize ? postData[pageSize].postCreatedAt : null,
    }

    return postPage
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
