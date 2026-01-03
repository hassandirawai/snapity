import { loginSchema } from "~/utils/zod-schemas"
import { findUserByUsername } from "~~/server/utils/queries";

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(event, (body) => loginSchema.parse(body))

  const user = await findUserByUsername(username)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password',
      data: 'Invalid username or password'
    });
  }

  const isVaildPassword: boolean = await verifyPassword(user.password, password)
  if (!isVaildPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password',
      data: 'Invalid username or password'
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      avatar: user.image,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
    lastLogin: new Date()
  })

  return {
    success: true,
    message: 'User logged in successfully',
    data: {
      id: user.id,
      avatar: user.image,
      username: user.username,
      email: user.email,
      fullName: user.fullName
    }
  }
})
