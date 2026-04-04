import type { PostInput } from '../types/post'

export async function useSubmitPost({ content, mediaIds }: PostInput) {
  return await $fetch<PostDataType>('/api/posts', {
    method: 'POST',
    body: {
      content,
      mediaIds,
    },
  })
}
