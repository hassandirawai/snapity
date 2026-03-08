export async function useUpdateUserProfile(userData: UpdateUserDataValues) {
  const { user: loggedInUser } = useUserSession()

  return await $fetch<UserDataType>(`/api/users/user/${loggedInUser.value?.id}`, {
    method: 'PATCH',
    body: userData,
  })
}
