<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{
  username: string
}>()

const { data: userData, isLoading: _isLoading } = useQuery({
  queryKey: ['user', props.username],
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
  <ClientOnly>
    <NuxtLink
      v-if="!userData"
      :to="`/users/${props.username}`"
      class="text-primary hover:underline"
    >
      @{{ props.username }}
    </NuxtLink>
    <UserTooltip
      v-else
      :user-data="userData"
    >
      <NuxtLink
        :to="`/users/${props.username}`"
        class="text-primary hover:underline"
      >
        @{{ props.username }}
      </NuxtLink>
    </UserTooltip>

    <template #fallback>
      <div class="w-65">
        <Skeleton />
      </div>
    </template>
  </ClientOnly>
</template>
