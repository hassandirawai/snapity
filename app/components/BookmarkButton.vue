<script lang="ts" setup>
import type { ButtonProps } from './ui/button/Button.vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { cn } from '~/lib/utils'

interface BookmarkButtonProps extends ButtonProps {
  postId: string
  initialState: BookmarkInfo
}

const props = defineProps<BookmarkButtonProps>()

const queryClient = useQueryClient()

const { data: bookmarkData } = useQuery({
  queryKey: ['bookmark-info', props.postId],
  queryFn: () => {
    return $fetch(`/api/posts/${props.postId}/bookmark`, {
      method: 'GET',
    })
  },
  initialData: props.initialState,
  staleTime: Infinity,
})

const queryKey = ['bookmark-info', props.postId]

let mutationQueue = Promise.resolve()

// This function queues a mutation to run after the current queue is resolved
function queueMutation(fn: () => Promise<any>) {
  mutationQueue = mutationQueue.then(fn).catch(() => {})

  return mutationQueue
}

const { mutate } = useMutation({
  mutationFn: async ({ isBookmarkedByUser }: BookmarkInfo) => {
    return queueMutation(() =>
      $fetch(`/api/posts/${props.postId}/bookmark`, {
        method: isBookmarkedByUser ? 'DELETE' : 'POST',
      }),
    )
  },
  onMutate: async (currnetBookmarkData: BookmarkInfo) => {
    toast.success(`Post has been ${currnetBookmarkData.isBookmarkedByUser ? 'un' : ''}bookmarked`)

    await queryClient.cancelQueries({
      queryKey,
    })

    queryClient.setQueryData<BookmarkInfo>(
      queryKey,
      (oldData) => {
        if (!oldData) {
          return oldData
        }

        return {
          isBookmarkedByUser: !oldData?.isBookmarkedByUser,
        }
      },
    )

    return { currnetBookmarkData }
  },
  onSuccess: async () => {
    // await queryClient.invalidateQueries({ queryKey: ['bookmarks-feed'] })
  },
  onError: (_error, _newBookmarkData, context) => {
    queryClient.setQueryData(queryKey, context?.currnetBookmarkData)
  },
})
</script>

<template>
  <ClientOnly>
    <Button
      :class="cn(props.class)"
      variant="ghost"
      @click="mutate(bookmarkData)"
    >
      <Icon
        :name="bookmarkData.isBookmarkedByUser ? 'fluent:bookmark-20-filled' : 'fluent:bookmark-20-regular'"
        :class="cn('text-xl', bookmarkData.isBookmarkedByUser && 'text-primary')"
      />
    </Button>
  </ClientOnly>
</template>
