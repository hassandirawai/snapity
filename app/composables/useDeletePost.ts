export async function useUseDeletePost(id: string) {
  return await $fetch<PostType>(`/api/posts/${id}`, {
    method: 'DELETE',
  })
}
