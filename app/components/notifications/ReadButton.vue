<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'

interface NotificationsButtonProps {
  initialState: NotificationsCountInfoType
}

const props = defineProps<NotificationsButtonProps>()

const { data: notificationsCountInfo } = useQuery({
  queryKey: ['unread-notifications-count'],
  initialData: props.initialState,
  queryFn: async () => {
    return await $fetch<NotificationsCountInfoType>('/api/notifications/unread-count')
  },
  refetchInterval: 60 * 1000,
})
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <Button
        variant="ghost"
        title="Messages"
        class="flex items-center justify-start gap-3"
        as-child
      >
        <NuxtLink to="/messages">
          <Icon
            name="fluent:alert-20-regular"
            class="text-xl"
          />
          <span class="hidden lg:inline">Notifications</span>
        </NuxtLink>
      </Button>
    </template>

    <Button
      variant="ghost"
      title="Notifications"
      class="flex items-center justify-start gap-3"
      as-child
    >
      <NuxtLink to="/notifications">
        <div class="relative">
          <Icon
            name="fluent:alert-20-regular"
            class="text-xl"
          />
          <span
            v-if="notificationsCountInfo?.unreadCount > 0"
            class="absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground px-1 text-xs font-medium tabular-nums"
          >
            {{ notificationsCountInfo.unreadCount }}
          </span>
        </div>
        <span class="hidden lg:inline">Notifications</span>
      </NuxtLink>
    </Button>
  </ClientOnly>
</template>
