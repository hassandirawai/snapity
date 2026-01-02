import { getPostsByHashtag } from '~~/server/utils/queries'

export default defineEventHandler(async (event) => {
  try {
    const tag = getRouterParam(event, 'tag') as string | undefined

    await requireUserSession(event)

    if (!tag) {
      throw createError({
        statusCode: 400,
        message: 'Tag is required',
      })
    }

    return await getPostsByHashtag(tag)
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
