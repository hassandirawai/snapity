import type { UserDataType } from './user'
import { sql } from 'drizzle-orm'
import { bookmark, hashtags, like, media, post } from '~~/server/db/schema'
import { userDataSelect } from './user'

export interface PostDataType {
  user: UserDataType
  post: {
    id: string
    content: string
    createdAt: Date
    hashtags: string[]
    attachments: MediaType[]
    likesCount: number
    isLikedByUser?: boolean
    isBookmarkedByUser: boolean
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

export function postDataSelect(loggedInUserId?: string) {
  return {
    post: {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      hashtags: sql<string[]>`ARRAY_AGG(DISTINCT ${hashtags.tag})`.as('hashtags'),
      attachments: sql<MediaType[]>`
        JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'id', ${media.id},
            'type', ${media.type},
            'pathname', ${media.pathname},
            'createdAt', ${media.createdAt}
          )
        ) FILTER (WHERE ${media.postId} IS NOT NULL)
      `.as('attachments'),
      likesCount: sql<number>`(
        SELECT COUNT(*) from ${like}
        WHERE ${like.postId} = ${post.id}
        )::int`.as('likes_count'),
      ...(loggedInUserId && {
        isLikedByUser: sql<boolean>`EXISTS (
          SELECT 1 FROM ${like}
          WHERE ${like.postId} = ${post.id}
          AND ${like.userId} = ${loggedInUserId}
        )`.as('isliked_by_user'),
        isBookmarkedByUser: sql<boolean>`EXISTS (
          SELECT 1 FROM ${bookmark}
          WHERE ${bookmark.postId} = ${post.id}
          AND ${bookmark.userId} = ${loggedInUserId}
        )`.as('is_bookmarked_by_user'),
      }),
    },
    user: {
      ...userDataSelect(loggedInUserId),
    },
  }
}
