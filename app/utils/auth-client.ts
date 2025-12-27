import { usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

const getBaseURL = () => {
  // On client-side, use window.location to construct absolute URL
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`
  }

  // Fallback for server-side or SSR
  return import.meta.env.NUXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
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
