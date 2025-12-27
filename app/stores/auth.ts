import type { SignInCredentials } from '~/types/auth'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const loading = ref<boolean>(false)
  const initialized = ref<boolean>(false)

  async function fetchSession() {
    try {
      const { data } = await authClient.getSession()
      session.value = data
    }
    catch (error: any) {
      console.error('Failed to fetch session:', error)
      session.value = null
    }
  }

  async function initializeAuth() {
    if (initialized.value) return

    loading.value = true
    try {
      await fetchSession()
    }
    finally {
      loading.value = false
      initialized.value = true
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
    initialized,
    fetchSession,
    initializeAuth,
    signIn,
    signOut,
  }
}, {
  persist: true,
})
