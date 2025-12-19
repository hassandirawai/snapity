import type { H3Event } from 'h3'
import { auth } from '~/utils/auth'

export async function requiredUser(event: H3Event) {
  // Get user session
  const session = await auth.api.getSession({
    headers: event!.headers,
  })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: `Unauthorized, error occurs at ${event}`,
    })
  }

  return session.user
}
