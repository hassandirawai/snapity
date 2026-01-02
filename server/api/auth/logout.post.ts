export default defineEventHandler(async (event) => {
  try {
    await clearUserSession(event)
    return {
      status: 'success',
      message: 'User logged out successfully'
    }
  } catch (error) {
    console.error('Logout error: ', error);
    throw createError({ statusCode: 500, statusMessage: 'An error occurred during logout' });
  }
})
