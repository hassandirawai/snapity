import { usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  baseURL: import.meta.env.NUXT_PUBLIC_BETTER_AUTH_URL || '/',
  plugins: [
    usernameClient(),
  ],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  listAccounts,
} = authClient

export type Session = typeof authClient.$Infer.Session
