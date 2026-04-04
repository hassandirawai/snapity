export default defineNuxtRouteMiddleware(async (to) => {
  const isAuthRoute = ['/login', '/signup'].includes(to.path)
  const isHome = to.path === '/'

  const { loggedIn, fetch: fetchUserSession } = useUserSession()

  if (import.meta.client) {
    // Fetch user session if does not exist
    await fetchUserSession()
  }

  if (isHome && !loggedIn.value)
    return navigateTo('/login')

  if (isAuthRoute && loggedIn.value)
    return navigateTo('/')
})
