import { z } from 'zod'
import { signUpSchema } from '~/utils/zod-schemas'

export interface FollowerInfo {
  followers: number
  isFollowedByUser: boolean
}

export interface UserProfile {
  id: string
  avatar: string | null
  username: string | null
  email: string | null
  fullName: string
  createdAt: Date
  followers: string[]
  followersCount: number
  postsCount: number
}

export interface UserType {
  id: string
  avatar: string | null
  username: string
  email: string
  fullName: string | null
}

export type CreateUser = z.infer<typeof signUpSchema>
