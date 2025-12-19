export async function useSubmitPost(postContent: string) {
  return await $fetch<PostType>('/api/posts', {
    method: 'POST',
    body: {
      content: postContent,
    },
  })
}
