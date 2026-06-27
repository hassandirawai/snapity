export default defineEventHandler(async (event) => {
  const pathname = getRouterParam(event, 'pathname')
  if (!pathname) {
    throw createError({
      statusCode: 404,
      statusMessage: 'pathname is required',
    })
  }

  // Tell the browser to cache the image for 1 hour
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')

  console.warn('pathname:', pathname)
  return blob.serve(event, pathname)
})
