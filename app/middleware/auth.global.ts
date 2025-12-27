export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client-side to avoid SSR issues
  if (process.server)
    return

  const auth = useAuthStore()

  // Skip if session is being loaded or being cleared
  if (auth.loading)
    return

  // Fetch session only if not yet loaded and not in logout transition
  if (!auth.session && !auth.loading) {
    try {
      await auth.fetchSession()
    }
    catch (error) {
      console.error('Failed to fetch session:', error)
      // Continue without session - let the page decide what to do
    }
  }

  const isAuthRoute = ['/login', '/signup'].includes(to.path)
  const isHome = to.path === '/'

  if (isHome && !auth.session)
    return navigateTo('/login')

  if (isAuthRoute && auth.session)
    return navigateTo('/')
})
