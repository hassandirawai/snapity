import type { UserDataType } from './users'
import { sql } from 'drizzle-orm'
import { follows, hashtags, media, postReactions, posts, user } from '~~/server/db/schema'

export interface PostDataType {
  user: UserDataType
  post: {
    id: string
    content: string
    createdAt: Date
    likesCount: number
    disLikesCount: number
    likers: string[]
    disLikers: string[]
    hashtags: string[]
    attachments: MediaType[]
  }
}

export interface MediaType {
  id: string
  postId: string
  type: string
  url: string
  uploadedById: string
  pathname: string
  createdAt: Date
}

export interface PostPageType {
  postsData: PostDataType[]
  nextCursor: Date | null
}

export function postDataSelect() {
  return {
    post: {
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      likesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'LIKE' THEN 1 END)`.as('likesCount'),
      disLikesCount: sql<number>`COUNT(DISTINCT CASE WHEN ${postReactions.reactionType} = 'DISLIKE' THEN 1 END)`.as('disLikesCount'),
      likers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'LIKE' THEN ${postReactions.userId} END)`.as('likers'),
      disLikers: sql<string[]>`ARRAY_AGG(DISTINCT CASE WHEN ${postReactions.reactionType} = 'DISLIKE' THEN ${postReactions.userId} END)`.as('disLikers'),
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      attachments: sql<MediaType[]>`
        JSON_AGG(
          JSONB_BUILD_OBJECT(
            'id', ${media.id},
            'type', ${media.type},
            'pathname', ${media.pathname},
            'createdAt', ${media.createdAt}
          )
        ) FILTER (WHERE ${media.postId} IS NOT NULL)
      `.as('attachments'),
    },
    user: {
      id: posts.authorId,
      avatar: user.avatar,
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      createdAt: user.createdAt,
      followers: sql<string[]>`ARRAY_AGG(${follows.followerId})`,
      followersCount: sql<number>`COUNT(${follows.followingId})::int`,
    },
  } satisfies Record<keyof PostDataType, any>
}
