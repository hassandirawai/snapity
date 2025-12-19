export interface PostType {
  id: string
  authorId: string
  authorAvatar: string | null
  authorName: string
  authorUsername: string | null
  postContent: string
  postCreatedAt: Date
  likesCount: number
  disLikesCount: number
  likers: string[]
  disLikers: string[]
  hashtags: string[]
}

export interface PostPageType {
  posts: PostType[]
  nextCursor: Date | null
}
