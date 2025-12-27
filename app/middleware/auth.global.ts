export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client-side
  if (import.meta.server)
    return

  const auth = useAuthStore()

  // Initialize auth on first load
  if (!auth.initialized) {
    await auth.initializeAuth()
  }

  const isAuthRoute = ['/login', '/signup'].includes(to.path)
  const isHome = to.path === '/'

  if (isHome && !auth.session)
    return navigateTo('/login')

  if (isAuthRoute && auth.session)
    return navigateTo('/')
})
