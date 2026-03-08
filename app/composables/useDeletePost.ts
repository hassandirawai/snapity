export async function useUseDeletePost(id: string) {
  return await $fetch<PostDataType>(`/api/posts/${id}`, {
    method: 'DELETE',
  })
}
