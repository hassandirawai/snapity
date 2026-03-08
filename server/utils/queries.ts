import type { PostDataType } from '~~/shared/types/posts'
import type { UserDataType } from '~~/shared/types/users'
import type { CreateUser } from '~/utils/zod-schemas'
import { and, desc, eq, lt, sql } from 'drizzle-orm'
import { userDataSelect } from '~~/shared/types/users'
import { follows, hashtags, postHashtags, posts, user } from '../db/schema'

// Get user by username
export async function findUserByUsername(username: string, withPassword?: boolean) {
  const db = useDrizzle()

  const data = await db
    .select({
      ...userDataSelect(),
      password: withPassword ? user.password : sql<string>`''`,
    })
    .from(user)
    .leftJoin(follows, eq(user.id, follows.followingId))
    .leftJoin(posts, eq(user.id, posts.authorId))
    .where(
      eq(user.username, username),
    )
    .groupBy(tables.user.id)
    .orderBy(desc(tables.user.id))

  return data[0]
}

// Get user by id
export async function findUserById(id: string): Promise<UserDataType> {
  const db = useDrizzle()

  const data = await db
    .select(userDataSelect())
    .from(user)
    .leftJoin(follows, eq(user.id, follows.followingId))
    .leftJoin(posts, eq(user.id, posts.authorId))
    .where(
      eq(user.id, id),
    )
    .groupBy(tables.user.id)
    .orderBy(desc(tables.user.id))

  return data[0]
}

// Get user by email
export async function findUserByEmail(email: string) {
  const db = useDrizzle()

  const data = await db
    .select()
    .from(user)
    .where(eq(user.email, email))

  return data[0]
}

// Create user
export async function createUser(userData: CreateUser) {
  const db = useDrizzle()

  const hashedPassword = await hashPassword(userData.password)

  const data = await db
    .insert(user)
    .values({
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    })
    .returning()

  return data[0]
}

// Get posts with reactions and hashtags
export async function getForYouFeedPosts({
  pageSize,
  cursorDate,
}: {
  pageSize: number
  cursorDate?: Date
}): Promise<PostDataType[]> {
  const { posts, postReactions, user, hashtags, postHashtags, follows } = tables

  const db = useDrizzle()

  // Get posts
  return db
    .select({
      post: {
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
        disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
        likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
        disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
        hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      },
      user: {
        id: posts.authorId,
        avatar: user.avatar,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio,
        createdAt: user.createdAt,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN ${follows.followerId} END)`,
        followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN 1 END)`,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .leftJoin(follows, eq(user.id, follows.followingId))
    .groupBy(posts.id, posts.authorId, posts.content, posts.createdAt, user.avatar, user.fullName, user.username, user.createdAt, user.bio)
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
}): Promise<PostDataType[]> {
  const { posts, postReactions, user, follows } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      post: {
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
        disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
        likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
        disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
        hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      },
      user: {
        id: posts.authorId,
        avatar: user.avatar,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio,
        createdAt: user.createdAt,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN ${follows.followerId} END)`,
        followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN 1 END)`,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .leftJoin(follows, eq(follows.followingId, user.id))
    .groupBy(posts.id, posts.authorId, posts.content, posts.createdAt, user.avatar, user.fullName, user.username, user.createdAt, user.bio)
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
}): Promise<PostDataType[]> {
  const { posts, postReactions, user, follows } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      post: {
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
        disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
        likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
        disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
        hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      },
      user: {
        id: posts.authorId,
        avatar: user.avatar,
        fullName: user.fullName,
        username: user.username,
        createdAt: user.createdAt,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN ${follows.followerId} END)`,
        followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN 1 END)`,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .leftJoin(follows, eq(follows.followingId, user.id))
    .groupBy(posts.id, posts.authorId, posts.content, posts.createdAt, user.avatar, user.fullName, user.username, user.createdAt)
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
Promise<PostDataType[]> {
  const { posts, postReactions, user, hashtags, postHashtags, follows } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      post: {
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
        disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
        likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
        disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
        hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      },
      user: {
        id: posts.authorId,
        avatar: user.avatar,
        fullName: user.fullName,
        username: user.username,
        createdAt: user.createdAt,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN ${follows.followerId} END)`,
        followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN 1 END)`,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .groupBy(posts.id, posts.authorId, user.avatar, user.fullName, user.username, posts.content, posts.createdAt)
    .orderBy(desc(posts.createdAt))
}

export async function getPostsByHashtag(tag: string):
Promise<PostDataType[]> {
  const { posts, postReactions, user, hashtags, postHashtags, follows } = tables

  const db = useDrizzle()

  // Get posts
  return await db
    .select({
      post: {
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
        disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
        likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
        disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
        hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      },
      user: {
        id: posts.authorId,
        avatar: user.avatar,
        fullName: user.fullName,
        username: user.username,
        createdAt: user.createdAt,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN ${follows.followerId} END)`,
        followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN 1 END)`,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .leftJoin(follows, eq(user.id, follows.followingId))
    .where(eq(hashtags.tag, tag))
    .groupBy(posts.id, posts.authorId, posts.content, posts.createdAt, user.avatar, user.fullName, user.username, user.createdAt)
}

export async function getPostById(id: string): Promise<PostDataType> {
  const { posts, postReactions, user, hashtags, postHashtags, follows } = tables

  const db = useDrizzle()

  // Get posts
  const postData = await db
    .select({
      post: {
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN 1 END)`.as('likesCount'),
        disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN 1 END)`.as('disLikesCount'),
        likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'like' THEN ${postReactions.userId} END)`.as('likers'),
        disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'dislike' THEN ${postReactions.userId} END)`.as('disLikers'),
        hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      },
      user: {
        id: posts.authorId,
        avatar: user.avatar,
        fullName: user.fullName,
        username: user.username,
        createdAt: user.createdAt,
        followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN ${follows.followerId} END)`,
        followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN 1 END)`,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .leftJoin(postReactions, eq(postReactions.postId, posts.id))
    .leftJoin(postHashtags, eq(postHashtags.postId, posts.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtags.hashtagId))
    .leftJoin(follows, eq(user.id, follows.followingId))
    .groupBy(posts.id, posts.authorId, posts.content, posts.createdAt, user.avatar, user.fullName, user.username, user.createdAt)
    .where(eq(posts.id, id))

  if (!postData[0]) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  return postData[0]
}
