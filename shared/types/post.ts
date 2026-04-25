import type { UserDataType } from './user'
import { sql } from 'drizzle-orm'
import { bookmark, follows, hashtags, like, media, post, user } from '~~/server/db/schema'

export interface PostDataType {
  user: UserDataType
  post: {
    id: string
    content: string
    createdAt: Date
    hashtags: string[]
    attachments: MediaType[]
    likesCount: number
    likes: string[]
    bookmarks: string[]
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
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      hashtags: sql<string[]>`ARRAY_AGG(${hashtags.tag})`.as('hashtags'),
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
      likesCount: sql<number>`COUNT(${like.userId})::int`.as('likes_count'),
      likes: sql<string[]>`ARRAY_AGG(${like.userId})`.as('likes'),
      bookmarks: sql<string[]>`ARRAY_AGG(${bookmark.userId})`.as('bookmarks'),
    },
    user: {
      id: post.authorId,
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
