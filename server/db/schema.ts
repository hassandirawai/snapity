import { relations } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  password: text('password').notNull(),
  bio: text('bio'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
})

// Post table
export const post = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Reaction enum-types
// export const reactionTypeEnum = pgEnum('reaction_type_enum', ['LIKE', 'DISLIKE'])

// Post likes table
export const like = pgTable('like', {
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => [
  // Unique constraint to ensure a user can't like the same post more than once
  unique('like_user_post_unique').on(table.userId, table.postId),
])

export const likeRelations = relations(like, ({ one }) => ({
  post: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
}))

export const bookmark = pgTable('bookmark', {
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, table => [
  // Unique constraint to ensure a user can't bookmark the same post more than once
  unique('bookmark_user_post_unique').on(table.userId, table.postId),
])

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [bookmark.postId],
    references: [post.id],
  }),
}))

export const comment = pgTable('comment', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const commentRelations = relations(comment, ({ one }) => ({
  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
}))

/* ------------------------------------------------------ */

// Hashtags
export const hashtags = pgTable('hashtag', {
  id: uuid('id').defaultRandom().primaryKey(),
  tag: text('tag').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Post Hashtags - Pivot Table
export const postHashtag = pgTable('post_hashtag', {
  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  hashtagId: uuid('hashtag_id')
    .notNull()
    .references(() => hashtags.id, { onDelete: 'cascade' }),
})

// Hashtags Relations
export const hashtagsRelations = relations(hashtags, ({ many }) => ({
  postHashtags: many(postHashtag),
}))

// Post Hashtags Relations
export const postHashtagsRelations = relations(postHashtag, ({ one }) => ({
  post: one(post, {
    fields: [postHashtag.postId],
    references: [post.id],
  }),
  hashtag: one(hashtags, {
    fields: [postHashtag.hashtagId],
    references: [hashtags.id],
  }),
}))

export const mediaType = pgEnum('media_type', ['IMAGE', 'VIDEO'])

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => post.id, { onDelete: 'set null' }),
  type: mediaType().notNull(),
  url: text('url').notNull(),
  uploadedById: uuid('uploaded_by_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  pathname: text('pathname').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
  postHashtags: many(postHashtag),
  attachments: many(media),
  likes: many(like),
  bookmark: many(bookmark),
  comments: many(comment),
}))

export const postMediaRelations = relations(media, ({ one }) => ({
  post: one(post, {
    fields: [media.postId],
    references: [post.id],
  }),
  uploader: one(user, {
    fields: [media.uploadedById],
    references: [user.id],
  }),
}))

// Follows table
export const follows = pgTable('follow', {
  followerId: uuid('follower_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  followingId: uuid('following_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => [
  // Unique constraint to ensure a user can't follow same user more than once
  unique('follower_following_unique').on(table.followerId, table.followingId),
])

// User Relations
export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  // People this user is following (where user.id = follower_id)
  following: many(follows, {
    relationName: 'userFollowing',
  }),
  // People following this user (where user.id = following_id)
  followers: many(follows, {
    relationName: 'userFollowers',
  }),
  media: many(media),
  likedPosts: many(like),
  bookmark: many(bookmark),
  comments: many(comment),
}))

// Follows Relations
export const followsRelations = relations(follows, ({ one }) => ({
  // The user doing the following
  follower: one(user, {
    fields: [follows.followerId],
    references: [user.id],
    relationName: 'userFollowing',
  }),
  // The user being followed
  following: one(user, {
    fields: [follows.followingId],
    references: [user.id],
    relationName: 'userFollowers',
  }),
}))
