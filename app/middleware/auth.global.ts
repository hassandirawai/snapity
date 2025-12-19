export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // Skip if session is being loaded or being cleared
  if (auth.loading)
    return

  // Fetch session only if not yet loaded and not in logout transition
  if (!auth.session && !auth.loading)
    await auth.fetchSession()

  const isAuthRoute = ['/login', '/signup'].includes(to.path)
  const isHome = to.path === '/'

  if (isHome && !auth.session)
    return navigateTo('/login')

  if (isAuthRoute && auth.session)
    return navigateTo('/')
})
