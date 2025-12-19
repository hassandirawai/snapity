import type { PostType } from '~~/shared/types/posts'
import { and, desc, eq, lt, or, sql } from 'drizzle-orm'
import { hashtags, postHashtags } from '../database/schema'

// Get posts with reactions and hashtags
export async function getForYouFeedPosts({
  pageSize,
  cursorDate,
}: {
  pageSize: number
  cursorDate?: Date
}): Promise<PostType[]> {
  const { posts, postReactions, user, hashtags, postHashtags } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      authorAvatar: user.image,
      authorName: user.name,
      authorUsername: user.username,
      postContent: posts.content,
      postCreatedAt: posts.createdAt,
      likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
      disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
      likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
      disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .groupBy(posts.id, posts.authorId, user.image, user.name, user.username, posts.content, posts.createdAt)
    .where(cursorDate ? lt(posts.createdAt, cursorDate) : undefined)
    .orderBy(desc(posts.createdAt))
    .limit(pageSize + 1)
}

export async function getFollowerFeedPosts({
  loggedInUserId,
  pageSize,
  cursorDate,
}: {
  loggedInUserId: string
  pageSize: number
  cursorDate?: Date
}): Promise<PostType[]> {
  const { posts, postReactions, user, follows } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      authorAvatar: user.image,
      authorName: user.name,
      authorUsername: user.username,
      postContent: posts.content,
      postCreatedAt: posts.createdAt,
      likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
      disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
      likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
      disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .leftJoin(follows, or(eq(follows.followerId, user.id), eq(follows.followingId, user.id)))
    .groupBy(posts.id, posts.authorId, user.image, user.name, user.username, posts.content, posts.createdAt)
    .where(
      and(
        cursorDate ? lt(posts.createdAt, cursorDate) : undefined,
        eq(
          follows.followerId,
          loggedInUserId,
        ),
        eq(
          follows.followingId,
          user.id,
        ),

      ),
    )
    .orderBy(desc(posts.createdAt))
    .limit(pageSize + 1)
}

export async function getUserPosts({
  userId,
  pageSize,
  cursorDate,
}: {
  userId: string
  pageSize: number
  cursorDate?: Date
}): Promise<PostType[]> {
  const { posts, postReactions, user, follows } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      authorAvatar: user.image,
      authorName: user.name,
      authorUsername: user.username,
      postContent: posts.content,
      postCreatedAt: posts.createdAt,
      likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
      disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
      likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
      disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .leftJoin(follows, or(eq(follows.followerId, user.id), eq(follows.followingId, user.id)))
    .groupBy(posts.id, posts.authorId, user.image, user.name, user.username, posts.content, posts.createdAt)
    .where(
      and(
        cursorDate ? lt(posts.createdAt, cursorDate) : undefined,
        eq(
          user.id,
          userId,
        ),

      ),
    )
    .orderBy(desc(posts.createdAt))
    .limit(pageSize + 1)
}

// Get posts with reactions and hashtags
export async function getPosts():
Promise<PostType[]> {
  const { posts, postReactions, user, hashtags, postHashtags } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      authorAvatar: user.image,
      authorName: user.name,
      authorUsername: user.username,
      postContent: posts.content,
      postCreatedAt: posts.createdAt,
      likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
      disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
      likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
      disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .groupBy(posts.id, posts.authorId, user.image, user.name, user.username, posts.content, posts.createdAt)
    .orderBy(desc(posts.createdAt))
}

export async function getPostsByHashtag(tag: string):
Promise<PostType[]> {
  const { posts, postReactions, user, hashtags, postHashtags } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      authorAvatar: user.image,
      authorName: user.name,
      authorUsername: user.username,
      postContent: posts.content,
      postCreatedAt: posts.createdAt,
      likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
      disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
      likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
      disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .where(eq(hashtags.tag, tag))
    .groupBy(posts.id, posts.authorId, user.image, user.name, user.username, posts.content, posts.createdAt)
}

export async function getPostById(id: string): Promise<PostType> {
  const { posts, postReactions, user, hashtags, postHashtags } = tables

  const db = useDrizzle()

  // Get posts
  const postData = await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      authorAvatar: user.image,
      authorName: user.name,
      authorUsername: user.username,
      postContent: posts.content,
      postCreatedAt: posts.createdAt,
      likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
      disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
      likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
      disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .groupBy(posts.id, posts.authorId, user.image, user.name, user.username, posts.content, posts.createdAt)
    .where(eq(posts.id, id))

  if (!postData[0]) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  return postData[0]
}
