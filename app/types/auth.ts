export interface SignInCredentials {
  username: string
  password: string
}

export type AuthSession = Awaited<ReturnType<typeof authClient.useSession>> | null
