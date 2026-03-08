import type { PostInput } from '../types/post'

export async function useSubmitPost(input: PostInput) {
  return await $fetch<PostDataType>('/api/posts', {
    method: 'POST',
    body: {
      input,
    },
  })
}
