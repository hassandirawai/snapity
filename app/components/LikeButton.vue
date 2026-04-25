<script lang="ts" setup>
import type { ButtonProps } from './ui/button/Button.vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { cn } from '~/lib/utils'

interface LikesButtonProps extends ButtonProps {
  postId: string
  initialState: LikeInfo
}

const props = defineProps<LikesButtonProps>()

const queryClient = useQueryClient()

const { data: likeData } = useQuery({
  queryKey: ['like-info', props.postId],
  queryFn: () => {
    return $fetch(`/api/posts/${props.postId}/likes`, {
      method: 'GET',
    })
  },
  initialData: props.initialState,
  staleTime: Infinity,
})

const queryKey = ['like-info', props.postId]

let mutationQueue = Promise.resolve()

// This function queues a mutation to run after the current queue is resolved
function queueMutation(fn: () => Promise<any>) {
  mutationQueue = mutationQueue.then(fn).catch(() => {})

  return mutationQueue
}

const { mutate } = useMutation({
  mutationFn: async ({ isLikedByUser }: LikeInfo) => {
    return queueMutation(() =>
      $fetch(`/api/posts/${props.postId}/likes`, {
        method: isLikedByUser ? 'DELETE' : 'POST',
      }),
    )
  },
  onMutate: async (currnetLikeData: LikeInfo) => {
    await queryClient.cancelQueries({
      queryKey,
    })

    queryClient.setQueryData<LikeInfo>(
      queryKey,
      (oldData) => {
        if (!oldData) {
          return oldData
        }

        return {
          likesCount:
         (oldData.likesCount) + (oldData?.isLikedByUser ? -1 : 1),
          isLikedByUser: !oldData?.isLikedByUser,
        }
      },
    )

    return { currnetLikeData }
  },
  onSettled: () => {
    // queryClient.invalidateQueries({ queryKey })
  },
  onError: (_error, _newLikeData, context) => {
    queryClient.setQueryData(queryKey, context?.currnetLikeData)
  },
})
</script>

<template>
  <ClientOnly>
    <Button
      :class="cn(props.class)"
      variant="ghost"
      @click="mutate(likeData)"
    >
      <Icon
        :name="likeData.isLikedByUser ? 'fluent:heart-20-filled' : 'fluent:heart-20-regular'"
        :class="cn('text-xl', likeData.isLikedByUser && 'text-red-500')"
      />
      <span class="flex items-center">
        {{ likeData.likesCount }} likes
      </span>
    </Button>
  </ClientOnly>
</template>
