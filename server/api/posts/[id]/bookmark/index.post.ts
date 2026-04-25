import { eq } from 'drizzle-orm'
import { bookmark, post } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  const { user: loggedInUser } = await requireUserSession(event)

  // Get post id
  const postId = getRouterParam(event, 'id') as string | undefined
  if (!postId) {
    throw createError({
      statusCode: 400,
      message: 'Post id is required',
    })
  }

  const db = useDrizzle()

  const postData = await db
    .select()
    .from(post)
    .where(eq(post.id, postId))

  if (!postData[0]) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  const data = await db
    .insert(bookmark)
    .values({
      userId: loggedInUser.id,
      postId,
    })
    .returning()

  return data
})
