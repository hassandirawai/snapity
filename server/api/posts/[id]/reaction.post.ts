export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated
    const { user: loggedInUser } = await requireUserSession(event)

    // Get post id
    const postId = getRouterParam(event, 'id') as string | undefined
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Post id is required',
      })
    }
    // Get like type
    const { reactionType } = await readBody(event)

    const reaction = await useDrizzle()
      .insert(tables.postReactions)
      .values({
        reactionType,
        postId,
        userId: loggedInUser.id,
      })
      .onConflictDoUpdate({
        target: [tables.postReactions.postId, tables.postReactions.userId],
        set: {
          reactionType,
        },
      })
      .returning({
        reactionType: tables.postReactions.reactionType,
        userId: tables.postReactions.userId,
        postId: tables.postReactions.postId,
      })

    return reaction
  }
  catch (error) {
    console.warn(error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
