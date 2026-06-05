import { eq } from 'drizzle-orm'
import { post } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const postId = getRouterParam(event, 'id') as string || undefined

  if (!postId) {
    throw createError({
      statusCode: 400,
      message: 'Post ID is required',
    })
  }

  const postData = await getPostById(postId)

  if (postData.user.id !== loggedInUser.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not authorized to delete this post',
    })
  }

  const db = useDrizzle()

  const deletedPosts = await db
    .delete(post)
    .where(eq(post.id, postData.post.id))
    .returning()

  return postData
})
