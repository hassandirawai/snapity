export default defineEventHandler(async (event) => {
  const cursorDateParam = getRouterParam(event, 'cursorDate')
  const cursorDate = cursorDateParam ? new Date(cursorDateParam) : undefined
  const pageSize = 5

  const { user: loggedInUser } = await requireUserSession(event)

  // console.log(cursorDate)
  // await new Promise(r => setTimeout(r, 2000))

  const notificationsData = await getNotificationsForUser({
    pageSize,
    cursorDate,
    loggedInUserId: loggedInUser.id,
  })

  const notificationsPage: NotificationsPageType = {
    notificationsData: notificationsData.slice(0, pageSize),
    nextCursor: notificationsData.length > pageSize ? notificationsData[pageSize].createdAt : null,
  }

  return notificationsPage
})
