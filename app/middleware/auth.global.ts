export default defineNuxtRouteMiddleware(async (to) => {
  const isAuthRoute = ['/login', '/signup'].includes(to.path)
  const isHome = to.path === '/'

  const session = useUserSession()

  // Fetch user session if does not exist
  await session.fetch()

  if (isHome && !session.loggedIn.value)
    return navigateTo('/login')

  if (isAuthRoute && session.loggedIn.value)
    return navigateTo('/')
})
