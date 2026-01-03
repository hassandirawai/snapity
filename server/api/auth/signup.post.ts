import { signUpSchema } from "~/utils/zod-schemas";
import { createUser, findUserByEmail, findUserByUsername } from "~~/server/utils/queries";

export default defineEventHandler(async (event) => {



  const user = await readValidatedBody(event, signUpSchema.parse)

  const takenUsername = await findUserByUsername(user.username)
  if (takenUsername) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Username already taken',
      data: "Username already taken"
    });
  }

  const takenEmail = await findUserByEmail(user.email)
  if (takenEmail) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already taken',
      data: "Email already taken"
    });
  }

  const newUser = await createUser(user)

  // Set user session
  await setUserSession(event, {
    user: {
      id: newUser.id,
      avatar: newUser.image,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName
    },
    lastLogin: new Date()
  })

  return {
    success: true,
    message: 'User created successfully',
    data: {
      id: newUser.id,
      avatar: newUser.image,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName
    }
  }
})
