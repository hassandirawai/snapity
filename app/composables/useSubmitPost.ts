import type { PostInput } from '../types/post'

export async function useSubmitPost({ postContent, mediaIds }: PostInput) {
  return await $fetch<PostDataType>('/api/posts', {
    method: 'POST',
    body: {
      postContent,
      mediaIds,
    },
  })
}
