import { sql } from 'drizzle-orm'
import { follows, posts, user } from '../../server/db/schema'

export interface FollowerInfo {
  followers: number
  isFollowedByUser: boolean
}

export interface UserDataType {
  id: string
  avatar: string | null
  username: string
  email?: string | null
  fullName: string
  bio?: string | null
  createdAt: Date
  followers: string[]
  followersCount: number
  postsCount?: number
}

export function userDataSelect() {
  return {
    id: user.id,
    avatar: user.avatar,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
    createdAt: user.createdAt,
    followers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN ${follows.followerId} END)`,
    followersCount: sql<number>`COUNT(DISTINCT CASE WHEN ${user.id} = ${follows.followingId} THEN 1 END)`,
    postsCount: sql<number>`COUNT(${posts.id})`,
  } satisfies Record<keyof UserDataType, any>
}

export interface UserSessionType {
  id: string
  avatar: string | null
  fullName: string | null
  username: string
  email: string
}
