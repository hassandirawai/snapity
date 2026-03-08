export async function useUpdateUserAvatar(avatar: File) {
  const { user: loggedInUser } = useUserSession()

  if (!avatar)
    return

  const formData = new FormData()
  formData.append('avatar', avatar)

  return await $fetch(`/api/users/user/${loggedInUser.value?.id}/avatar`, {
    method: 'PATCH',
    body: formData,
  })
}
