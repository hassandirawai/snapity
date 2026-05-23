import { createUser, findUserByEmail } from '~~/server/utils/queries'
import { signUpSchema } from '~/utils/zod-schemas'

export default defineEventHandler(async (event) => {
  const parsedUser = await readValidatedBody(event, signUpSchema.parse)

  const data = await findUserByUsername({
    username: parsedUser.username,
  })

  if (data) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Username already taken',
      data: 'Username already taken',
    })
  }

  const takenEmail = await findUserByEmail(parsedUser.email)
  if (takenEmail) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already taken',
      data: 'Email already taken',
    })
  }

  const newUser = await createUser(parsedUser)

  // Set user session
  await setUserSession(event, {
    user: {
      id: newUser.id,
      avatar: newUser.avatar,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
    },
    lastLogin: new Date(),
  })

  return {
    success: true,
    message: 'User created successfully',
    data: {
      id: newUser.id,
      avatar: newUser.avatar,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
    },
  }
})
