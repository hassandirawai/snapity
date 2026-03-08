import { z } from 'zod'

// const requiredString = z.string().min(1, { message: 'Required' })

// Sign-Up schema
export const signUpSchema = z.object({
  fullName: z
    .string({ error: 'Please enter your full name.' })
    .min(3, { error: 'Full name should be at least 3 characters long.' }),
  username: z
    .string({ error: 'Please choose a username.' })
    .min(3, { error: 'Username should be at least 3 characters long.' })
    .lowercase({ error: 'Username must be lowercase.' })
    .regex(/^\w+$/, { error: 'Username can only include letters, numbers, and underscores.' }),
  email: z
    .email({ error: 'That doesn’t look like a valid email. Please check again.' }),
  password: z
    .string({ error: 'Please create a password.' })
    .min(8, { error: 'Password should be at least 8 characters long for better security.' }),
})

export type CreateUser = z.infer<typeof signUpSchema>

// Login schema
export const loginSchema = z.object({
  username: z
    .string(({ error: 'Username is required' }))
    .trim()
    .min(1, { error: 'Username is required' }),
  password: z
    .string(({ error: 'Username is required' }))
    .trim()
    .min(1, { error: 'Password is required' }),
})

// Create post schema
export const createPostSchema = z.object({
  content: z
    .string({ error: 'Content is required' })
    .min(4, { error: 'Content must be at least 4 characters long' }),
  mediaIds: z
    .array(z.uuid().max(5, { error: 'Cannot upload more than 5 media files' }))
    .optional()
    // insted of setting the mediaIds to undefined if not provided, set it to an empty array
    .default([]),
})

export type CreatePostSchemaType = z.infer<typeof createPostSchema>

// Update user schema
export const updateUserDataSchema = z.object({
  fullName: z
    .string({ error: 'Full name is required' })
    .min(3, { error: 'Full name should be at least 3 characters long.' }),
  bio: z
    .string()
    .max(1000, { error: 'Bio should be at most 1000 characters long.' })
    .optional(),
})

export type UpdateUserDataValues = z.infer<typeof updateUserDataSchema>
