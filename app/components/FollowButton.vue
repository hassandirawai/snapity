<script lang="ts" setup>
import type { ButtonProps } from './ui/button/Button.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { cn } from '~/lib/utils'

interface FollowButtonProps extends ButtonProps {
  userId: string
  initialState: FollowerInfo
}

const props = defineProps<FollowButtonProps>()

const queryClient = useQueryClient()

const { data: followerData } = useFollowerInfo(props.userId, props.initialState)

const queryKey = ['follower-info', props.userId]

const { mutate } = useMutation({
  mutationFn: async () => {
    // console.log(data.value.isFollowedByUser)

    if (!followerData.value.isFollowedByUser) {
      return await $fetch(`/api/users/user/${props.userId}/followers`, {
        method: 'DELETE',
      })
    }
    else {
      return await $fetch(`/api/users/user/${props.userId}/followers`, {
        method: 'POST',
      })
    }
  },
  onMutate: async () => {
    await queryClient.cancelQueries({
      queryKey,
    })

    const previousState = queryClient.getQueryData<FollowerInfo>(queryKey)

    queryClient.setQueryData<FollowerInfo>(
      queryKey,
      (oldState) => {
        if (!oldState) {
          return oldState
        }

        return {
          followersCount:
            (oldState.followersCount)
            + (oldState.isFollowedByUser ? -1 : 1),
          isFollowedByUser: !oldState.isFollowedByUser,
        }
      },
    )

    return { previousState }
  },
  onError: (_error, _variables, onMutateResult, _context) => {
    queryClient.setQueryData(queryKey, onMutateResult?.previousState)
    // console.log(_error)
  },
})
</script>

<template>
  <ClientOnly>
    <Button
      :class="cn(props.class)"
      :variant="followerData.isFollowedByUser ? 'secondary' : 'default'"
      @click="mutate()"
    >
      {{ followerData.isFollowedByUser ? 'Unfollow' : 'Follow' }}
    </Button>
  </ClientOnly>
</template>

<style></style>
