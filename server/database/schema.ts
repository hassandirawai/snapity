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
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique(),
  displayUsername: text('display_username'),
  bio: text('bio'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  providerId: text('provider_id').notNull(),
  accountId: text('account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
})

// Post table
export const posts = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Reaction enum-types
export const reactionTypeEnum = pgEnum('reaction_type_enum', ['like', 'dislike'])
// Post reactions table
export const postReactions = pgTable('post_reaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  reactionType: reactionTypeEnum('reaction_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
}, table => [unique('reaction_post_user_unique').on(table.userId, table.postId)])

// Hashtags
export const hashtags = pgTable('hashtag', {
  id: uuid('id').defaultRandom().primaryKey(),
  tag: text('tag').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Post Hashtags - Pivot Table
export const postHashtags = pgTable('post_hashtag', {
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  hashtagId: uuid('hashtag_id')
    .notNull()
    .references(() => hashtags.id, { onDelete: 'cascade' }),
})

// Hashtags Relations
export const hashtagsRelations = relations(hashtags, ({ many }) => ({
  postHashtags: many(postHashtags),
}))

// Post Hashtags Relations
export const postHashtagsRelations = relations(postHashtags, ({ one }) => ({
  post: one(posts, {
    fields: [postHashtags.postId],
    references: [posts.id],
  }),
  hashtag: one(hashtags, {
    fields: [postHashtags.hashtagId],
    references: [hashtags.id],
  }),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(user, {
    fields: [posts.authorId],
    references: [user.id],
  }),
  reactions: many(postReactions),
  postHashtags: many(postHashtags),
}))

// Follows table
export const follows = pgTable('follow', {
  followerId: text('follower_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  followingId: text('following_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => [
  // Unique constraint to ensure a user can't follow same user more than once
  unique('follower_following_unique').on(table.followerId, table.followingId),
])

// User Relations
export const userRelations = relations(user, ({ many }) => ({
  posts: many(posts),
  reactions: many(postReactions),
  // People this user is following (where user.id = follower_id)
  following: many(follows, {
    relationName: 'userFollowing',
  }),
  // People following this user (where user.id = following_id)
  followers: many(follows, {
    relationName: 'userFollowers',
  }),
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

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  post: one(posts, {
    fields: [postReactions.postId],
    references: [posts.id],
  }),
  user: one(user, {
    fields: [postReactions.userId],
    references: [user.id],
  }),
}))
