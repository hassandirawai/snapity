import { sql } from 'drizzle-orm'
import { follows, post, user } from '../../server/db/schema'

const userAlias = user

export interface UserDataType {
  id: string
  avatar: string | null
  username: string
  email: string
  fullName: string
  bio?: string | null
  createdAt: Date
  followersCount: number
  isFollowedByUser?: boolean
  postsCount: number
}

export function userDataSelect(loggedInUserId?: string) {
  return {
    id: user.id,
    avatar: user.avatar,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
    createdAt: user.createdAt,
    followersCount: sql<number>`(
      SELECT COUNT(*) from ${follows}
      WHERE ${follows.followingId} = ${user.id}
    )::int`.as('followers_count'),
    ...(loggedInUserId && {
      isFollowedByUser: sql<boolean>`EXISTS (
        SELECT 1 FROM ${follows}
        WHERE ${follows.followingId} = ${user.id}
        AND ${follows.followerId} = ${loggedInUserId}
      )`.as('is_followed_by_user'),
    }),
    postsCount: sql<number>`(
      SELECT COUNT(*) from ${post}
      WHERE ${post.authorId} = "user"."id"
    )::int`.as('posts_count'),
  }
}

export interface UserSessionType {
  id: string
  avatar: string | null
  fullName: string | null
  username: string
  email: string
}

export interface FollowerInfo {
  followersCount: number
  isFollowedByUser?: boolean
}

export interface LikeInfo {
  likesCount: number
  // Useful for displaying like or dislike button to the user
  isLikedByUser?: boolean
}

export interface BookmarkInfo {
  isBookmarkedByUser?: boolean
}
