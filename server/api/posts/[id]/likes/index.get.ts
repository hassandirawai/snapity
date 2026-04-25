import type { LikeInfo } from '~~/shared/types/user'
import { eq, sql } from 'drizzle-orm'
import { like, post } from '~~/server/db/schema'

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
      // This will be used to get the total number of likes for this post
      likesCount: sql<number>`COUNT(${like.userId})::int`.as('likes_count'),
      // This will be used to determine if the logged-in user has liked the post
      isLikedByUser: sql<boolean>`BOOL_OR(${like.userId} = ${loggedInUser.id})`.as('is_liked_by_user'),
    })
    .from(post)
    .where(eq(post.id, postId))
    .leftJoin(like, eq(like.postId, post.id))

  if (!postData[0]) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  const data: LikeInfo = {
    likesCount: postData[0].likesCount,
    isLikedByUser: !!postData[0].isLikedByUser,
  }

  return data
})
