export interface PostDataType {
  user: {
    id: string
    avatar: string | null
    fullName: string
    username: string
    createdAt: Date
    followers: string[]
    followersCount: number
  }
  post: {
    id: string
    content: string
    createdAt: Date
    likesCount: number
    disLikesCount: number
    likers: string[]
    disLikers: string[]
    hashtags: string[]
  }
}

export interface PostPageType {
  postsData: PostDataType[]
  nextCursor: Date | null
}
