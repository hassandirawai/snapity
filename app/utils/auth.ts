import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { useDrizzle } from '~~/server/utils/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(useDrizzle(), {
    provider: 'pg',
  }),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
  ],
  user: {
    additionalFields: {
      bio: {
        type: 'string',
        required: false,
        defaultValue: '',
        input: true,
      },
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    'http://192.168.1.4:3000',
    'https://snapity-chi.vercel.app',
  ],
})
