import { z } from 'zod'

// const requiredString = z.string().min(1, { message: 'Required' })

// Sign-Up schema
export const signUpSchema = z.object({
  firstName: z
    .string({ message: 'Please enter your first name.' })
    .min(3, { message: 'First name should be at least 3 characters long.' })
    .optional(),
  lastName: z
    .string({ message: 'Please enter your last name.' })
    .min(3, { message: 'Last name should be at least 3 characters long.' })
    .optional(),
  username: z
    .string({ message: 'Please choose a username.' })
    .min(3, { message: 'Username should be at least 3 characters long.' })
    .regex(/^\w+$/, { message: 'Username can only include letters, numbers, and underscores.' }),
  email: z
    .string({ message: 'Please enter your email address.' })
    .email({ message: 'That doesn’t look like a valid email. Please check again.' }),
  password: z
    .string({ message: 'Please create a password.' })
    .min(8, { message: 'Password should be at least 8 characters long for better security.' }),
})

// Login schema
export const loginSchema = z.object({
  username: z
    .string(({ message: 'Username is required' }))
    .trim()
    .min(1, { message: 'Username is required' }),
  password: z
    .string(({ message: 'Username is required' }))
    .trim()
    .min(1, { message: 'Password is required' }),
})

// Create post schema
export const createPostSchema = z.object({
  content: z
    .string({ message: 'Content is required' })
    .min(4, { message: 'Content must be at least 4 characters long' }),
})

export type CreatePostSchemaType = z.infer<typeof createPostSchema>
