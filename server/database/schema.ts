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
  displayUsername: text('display_username'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  password: text('password').notNull(),
  bio: text('bio'),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
})

// Post table
export const posts = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id')
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
  userId: uuid('user_id')
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
