<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{
  username: string
}>()

const { data: userData, isLoading } = useQuery({
  queryKey: ['user-data', props.username],
  queryFn: async () => {
    const userData = await $fetch<UserDataType>(`/api/users/user/username/${props.username}`)

    console.warn('userData:', userData.bio)
    return userData
  },
  retry: (failureCount, error) => {
    const fetchError = error as {
      statusCode?: number
      data?: {
        statusCode?: number
        statusMessage?: string
        message?: string
      }
    }

    if (fetchError.statusCode === 404) {
      return false
    }
    return failureCount < 3
  },
  staleTime: Infinity,
})
</script>

<template>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <div v-if="!userData">
      <NuxtLink
        :to="`/users/${props.username}`"
        class="text-primary hover:underline"
      >
        @{{ props.username }}
      </NuxtLink>
    </div>
    <div v-else>
      <UserTooltip :user-data="userData">
        <NuxtLink
          :to="`/users/${props.username}`"
          class="text-primary hover:underline"
        >
          @{{ props.username }}
        </NuxtLink>
      </UserTooltip>
    </div>
  </div>
</template>
