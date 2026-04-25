import { eq, sql } from 'drizzle-orm'
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
    .select({
      isBookmarkedByUser: sql<boolean>`BOOL_OR(${bookmark.userId} = ${loggedInUser.id})`.as('is_bookmarked_by_user'),
    })
    .from(post)
    .where(eq(post.id, postId))
    .leftJoin(bookmark, eq(bookmark.postId, post.id))

  if (!postData[0]) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  const bookmakrInfo: BookmarkInfo = {
    isBookmarkedByUser: !!postData[0].isBookmarkedByUser,
  }

  return bookmakrInfo
})
