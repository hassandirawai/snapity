export interface FollowerInfo {
  followers: number
  isFollowedByUser: boolean
}

export interface UserInfo {
  id: string
  avatar: string | null
  username: string | null
  name: string
  createdAt: Date
  followers: string[]
  followersCount: number
  postsCount: number
}
