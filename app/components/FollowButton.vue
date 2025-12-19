<script lang="ts" setup>
import type { ButtonProps } from './ui/button/Button.vue'
import { cn } from '~/lib/utils'
import { buttonVariants } from './ui/button'

interface FollowButtonProps extends ButtonProps {
  userId: string
  initialState: FollowerInfo
}

const props = withDefaults(defineProps<FollowButtonProps>(), {
})

const queryClient = useQueryClient()

const { data } = useFollowerInfo(props.userId, props.initialState)

const queryKey = ['follower-info', props.userId]

const { mutate } = useMutation({
  mutationFn: () => {
    // console.log(data.value.isFollowedByUser)

    if (!data.value.isFollowedByUser) {
      return $fetch(`/api/users/user/${props.userId}/followers`, {
        method: 'DELETE',
      })
    }
    else {
      return $fetch(`/api/users/user/${props.userId}/followers`, {
        method: 'POST',
      })
    }
  },
  onMutate: async () => {
    await queryClient.cancelQueries({
      queryKey,
    })

    // Get current state of data in case any error occurs with further mutation
    const previousState = queryClient.getQueryData<FollowerInfo>(queryKey)

    queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
      followers:
      (previousState?.followers || 0)
      + (previousState?.isFollowedByUser ? -1 : 1),
      isFollowedByUser: !previousState?.isFollowedByUser,
    }))

    return { previousState }
  },
  onError(_error, _variables, onMutateResult, _context) {
    queryClient.setQueryData(queryKey, onMutateResult?.previousState)
    // console.log(_error)
  },
})
</script>

<template>
  <Button
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :variant="data.isFollowedByUser ? 'secondary' : 'default'"
    @click="mutate()"
  >
    {{ data.isFollowedByUser ? 'Unfollow' : 'Follow' }}
  </Button>
</template>

<style>

</style>
