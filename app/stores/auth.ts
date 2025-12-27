import type { SignInCredentials } from '~/types/auth'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const loading = ref<boolean>(false)
  const signingOut = ref<boolean>(false)

  async function fetchSession() {
    loading.value = true
    // await new Promise(res => setTimeout(res, 10000))
    try {
      // Only run on client-side
      if (process.server) {
        loading.value = false
        return
      }

      const { data } = await authClient.getSession()
      session.value = data
    }
    catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch session:', error)
      session.value = null
    }
    finally {
      loading.value = false
    }
  }

  const loggedInUser = computed(() => session.value?.user || null)

  // Sign in with username and password
  async function signIn(credentials: SignInCredentials) {
    loading.value = true
    await authClient.signIn.username({
      username: credentials.username,
      password: credentials.password,
      fetchOptions: {
        onSuccess: async () => {
          await fetchSession()
          await navigateTo('/')
          toast.success('Logged in successfully.')
        },
        onError: () => {
          loading.value = false
          toast.error('Invalid username or password.')
        },
      },
    })
  }

  // Sign out
  async function signOut() {
    loading.value = true
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          session.value = null
          loading.value = false
          await navigateTo('/login')
        },
      },
    })
  }

  return {
    session,
    loggedInUser,
    loading,
    fetchSession,
    signIn,
    signOut,
    signingOut,
  }
}, {
  persist: true,
})
