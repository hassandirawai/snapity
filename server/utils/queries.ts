import type { PostDataType } from '~~/shared/types/post'
import type { UserDataType } from '~~/shared/types/user'
import type { CreateUser } from '~/utils/zod-schemas'
import { and, desc, eq, lt, ne, notExists, sql } from 'drizzle-orm'
import { postDataSelect } from '~~/shared/types/post'
import { userDataSelect } from '~~/shared/types/user'
import { bookmark, follows, hashtags, like, media, post, postHashtag, user } from '../db/schema'

// Get user by username
export async function findUserByUsername(username: string, withPassword?: boolean) {
  const db = useDrizzle()

  let data

  if (withPassword) {
    data = await db
      .select({
        ...userDataSelect(),
        password: withPassword ? user.password : sql<string>`''`,
      })
      .from(user)
      .leftJoin(follows, eq(user.id, follows.followingId))
      .leftJoin(post, eq(user.id, post.authorId))
      .where(
        eq(user.username, username),
      )
      .groupBy(tables.user.id)
      .orderBy(desc(tables.user.id))
  }
  else {
    data = await db
      .select(userDataSelect())
      .from(user)
      .leftJoin(follows, eq(user.id, follows.followingId))
      .leftJoin(post, eq(user.id, post.authorId))
      .where(
        eq(user.username, username),
      )
      .groupBy(tables.user.id)
      .orderBy(desc(tables.user.id))
  }

  return data[0]
}

// Get user by id
export async function findUserById(id: string): Promise<UserDataType> {
  const db = useDrizzle()

  const data = await db
    .select(userDataSelect())
    .from(user)
    .leftJoin(follows, eq(user.id, follows.followingId))
    .leftJoin(post, eq(user.id, post.authorId))
    .where(
      eq(user.id, id),
    )
    .groupBy(tables.user.id)
    .orderBy(desc(tables.user.id))

  if (!data[0]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

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

export async function getUsers({
  limit,
  loggedInUserId,
}: {
  limit?: number
  loggedInUserId: string
}): Promise<UserDataType[]> {
  const db = useDrizzle()

  const users = await db
    .select(userDataSelect())
    .from(tables.user)
    .leftJoin(follows, eq(user.id, follows.followingId))
    .leftJoin(post, eq(user.id, post.authorId))
    .where(
      and(
        ne(tables.user.id, loggedInUserId),
        notExists(
          db
            .select()
            .from(tables.follows)
            .where(
              and(
                eq(tables.follows.followingId, tables.user.id),
                eq(tables.follows.followerId, loggedInUserId),
              ),
            ),
        ),
      ),
    )
    .groupBy(tables.user.id)
    .orderBy(desc(tables.user.id))
    .limit(Number(limit ?? 10))

  if (!users.length) {
    throw createError({
      statusCode: 404,
      message: 'No users found',
    })
  }

  return users
}

// Create user
export async function createUser(userData: CreateUser) {
  const db = useDrizzle()

  const hashedPassword = await hashPassword(userData.password)

  const usersData = await db
    .insert(user)
    .values({
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    })
    .returning()

  if (!usersData[0]) {
    throw createError({
      statusCode: 400,
      message: 'Failed to create user',
    })
  }

  return usersData[0]
}

// Get posts with reactions and hashtags
export async function getForYouFeedPosts({
  pageSize,
  cursorDate,
}: {
  pageSize: number
  cursorDate?: Date
}): Promise<PostDataType[]> {
  const db = useDrizzle()

  // Get posts
  const postsData = await db
    .select(postDataSelect())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postHashtag, eq(postHashtag.postId, post.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtag.hashtagId))
    .leftJoin(follows, eq(user.id, follows.followingId))
    .leftJoin(media, eq(media.postId, post.id))
    .leftJoin(like, eq(like.postId, post.id))
    .leftJoin(bookmark, eq(bookmark.postId, post.id))
    .groupBy(post.id, post.authorId, post.content, post.createdAt, user.avatar, user.fullName, user.username, user.createdAt, user.bio)
    .where(cursorDate ? lt(post.createdAt, cursorDate) : undefined)
    .orderBy(desc(post.createdAt))
    .limit(pageSize + 1)

  if (!postsData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No posts found',
    })
  }

  return postsData
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
  const db = useDrizzle()

  // Get posts
  const postsData = await db
    .select(postDataSelect())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postHashtag, eq(postHashtag.postId, post.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtag.hashtagId))
    .leftJoin(follows, eq(follows.followingId, user.id))
    .leftJoin(media, eq(media.postId, post.id))
    .leftJoin(like, eq(like.postId, post.id))
    .leftJoin(bookmark, eq(bookmark.postId, post.id))
    .groupBy(post.id, post.authorId, post.content, post.createdAt, user.avatar, user.fullName, user.username, user.createdAt, user.bio)
    .where(
      and(
        cursorDate ? lt(post.createdAt, cursorDate) : undefined,
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
    .orderBy(desc(post.createdAt))
    .limit(pageSize + 1)

  if (!postsData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No posts found',
    })
  }

  return postsData
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
  const db = useDrizzle()

  // Get posts
  const postsData = await db
    .select(postDataSelect())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postHashtag, eq(postHashtag.postId, post.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtag.hashtagId))
    .leftJoin(follows, eq(follows.followingId, user.id))
    .leftJoin(media, eq(media.postId, post.id))
    .leftJoin(like, eq(like.postId, post.id))
    .leftJoin(bookmark, eq(bookmark.postId, post.id))
    .groupBy(post.id, post.authorId, post.content, post.createdAt, user.username, user.fullName, user.bio, user.avatar, user.createdAt)
    .where(
      and(
        cursorDate ? lt(post.createdAt, cursorDate) : undefined,
        eq(
          user.id,
          userId,
        ),

      ),
    )
    .orderBy(desc(post.createdAt))
    .limit(pageSize + 1)

  if (!postsData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No posts found',
    })
  }

  return postsData
}

// Get bookmark feed posts
export async function getBookmarksFeedPosts({
  userId,
  pageSize,
  cursorDate,
}: {
  userId: string
  pageSize: number
  cursorDate?: Date
}): Promise<PostDataType[]> {
  const db = useDrizzle()

  // Get posts
  const postsData = await db
    .select(postDataSelect())
    .from(bookmark)
    .leftJoin(post, eq(post.id, bookmark.postId))
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postHashtag, eq(postHashtag.postId, post.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtag.hashtagId))
    .leftJoin(follows, eq(follows.followingId, user.id))
    .leftJoin(media, eq(media.postId, post.id))
    .leftJoin(like, eq(like.postId, post.id))
    .groupBy(post.id, post.authorId, post.content, user.username, user.fullName, user.bio, user.avatar, user.createdAt, bookmark.createdAt)
    .where(
      and(
        cursorDate ? lt(bookmark.createdAt, cursorDate) : undefined,
        eq(
          bookmark.userId,
          userId,
        ),
      ),
    )
    .orderBy(desc(bookmark.createdAt))
    .limit(pageSize + 1)

  if (!postsData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No posts found',
    })
  }

  return postsData
}

// Get posts with reactions and hashtags
export async function getPosts():
Promise<PostDataType[]> {
  const db = useDrizzle()

  // Get posts
  return await db
    .select(postDataSelect())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postHashtag, eq(postHashtag.postId, post.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtag.hashtagId))
    .leftJoin(media, eq(media.postId, post.id))
    .leftJoin(like, eq(like.postId, post.id))
    .leftJoin(bookmark, eq(bookmark.postId, post.id))
    .groupBy(post.id, post.authorId, user.avatar, user.fullName, user.username, post.content, post.createdAt)
    .orderBy(desc(post.createdAt))
}

export async function getPostsByHashtag(tag: string):
Promise<PostDataType[]> {
  const db = useDrizzle()

  // Get posts
  return await db
    .select(postDataSelect())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postHashtag, eq(postHashtag.postId, post.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtag.hashtagId))
    .leftJoin(follows, eq(user.id, follows.followingId))
    .leftJoin(media, eq(media.postId, post.id))
    .leftJoin(like, eq(like.postId, post.id))
    .leftJoin(bookmark, eq(bookmark.postId, post.id))
    .where(eq(hashtags.tag, tag))
    .groupBy(post.id, post.authorId, post.content, post.createdAt, user.username, user.fullName, user.bio, user.avatar, user.createdAt)
}

export async function getPostById(id: string): Promise<PostDataType> {
  const db = useDrizzle()

  // Get posts
  const postData = await db
    .select(postDataSelect())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postHashtag, eq(postHashtag.postId, post.id))
    .leftJoin(hashtags, eq(hashtags.id, postHashtag.hashtagId))
    .leftJoin(follows, eq(user.id, follows.followingId))
    .leftJoin(media, eq(media.postId, post.id))
    .leftJoin(like, eq(like.postId, post.id))
    .leftJoin(bookmark, eq(bookmark.postId, post.id))
    .groupBy(post.id, post.authorId, post.content, post.createdAt, user.avatar, user.fullName, user.username, user.createdAt, user.bio)
    .where(eq(post.id, id))

  if (!postData[0]) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    })
  }

  return postData[0]
}
