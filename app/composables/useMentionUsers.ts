export async function useMentionableUsers(query: string): Promise<UserDataType[]> {
  return await $fetch('/api/users/search', {
    query: {
      query,
    },
  })
}
