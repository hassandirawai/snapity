<script lang="ts" setup>
import type { QueryKey } from '@tanstack/vue-query'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

// Fetch the notifications for the notifications feed
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, suspense }
  = useInfiniteQuery({
    queryKey: ['notifications-feed'],
    queryFn: async ({ pageParam }) => {
      const url = pageParam
        ? `/api/notifications/${pageParam}`
        : '/api/notifications/:cursorDate'

      return await $fetch<NotificationsPageType>(url, {
        headers: useRequestHeaders(['cookie']),
      })
    },
    initialPageParam: null as Date | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
  })

const queryClient = useQueryClient()
const { mutate } = useMutation({
  mutationFn: async () => {
    await $fetch('/api/notifications/mark-as-read', {
      method: 'PATCH',
    })
  },
  onSuccess: () => {
    const queryKey: QueryKey = ['unread-notifications-count']

    queryClient.setQueryData(queryKey, {
      unreadCount: 0,
    })
  },
  onError: (error) => {
    console.error('Failed to mark notifications as read', error)
  },
})

// Flatten the pages of notifications into a single array
const notificationsData = computed(() => data.value?.pages.flatMap(page => page.notificationsData) ?? [])

await suspense()

onMounted(() => {
  mutate()
})
</script>

<template>
  <!-- Show loading skeleton while fetching posts -->
  <NotificationsLoadingSkeletons v-if="status === 'pending'" />
  <!-- Show message if no posts are available -->
  <p
    v-else-if="status === 'success' && !notificationsData.length && !hasNextPage"
    class="text-center text-muted-foreground min-h-screen"
  >
    You don't have any notifications yet.
  </p>
  <!-- Show posts if available -->
  <InfiniteScrollContainer
    v-else
    class="space-y-6"
    :has-next-page="hasNextPage"
    :loading="isFetchingNextPage"
    @load-more="fetchNextPage"
  >
    <NotificationsItem
      v-for="notificationData in notificationsData"
      :key="notificationData.id"
      :notification-data="notificationData"
    />
    <div class="flex justify-center">
      <Spinner
        v-if="isFetchingNextPage"
        :size="24"
      />
    </div>
  </InfiniteScrollContainer>
</template>
