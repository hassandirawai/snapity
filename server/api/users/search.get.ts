import { and, ilike, ne, or } from 'drizzle-orm'
import { user } from '~~/server/db/schema'
import { searchSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  const { user: loggedInUser } = await requireUserSession(event)

  const { query } = await getValidatedQuery(event, searchSchema.parse)

  const db = useDrizzle()

  const users: UserDataType[] = await db
    .select(userDataSelect())
    .from(user)
    .where(
      and(
        ne(user.id, loggedInUser.id),
        or(
          ilike(user.username, `${query}%`),
          ilike(user.fullName, `%${query}%`),
        ),
      ),
    )
    .limit(8)

  return users
})
