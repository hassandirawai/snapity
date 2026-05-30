<script lang="ts" setup>
import type { notification } from '~~/server/db/schema'
import { cn } from '~/lib/utils'

interface NotificationProps {
  notificationData: NotificationDataType
}

const props = defineProps<NotificationProps>()

type NotificationType = typeof notification.$inferSelect['type']
const notificationTypeMap: Record<NotificationType, {
  message: string
  icon: string
  class: string
  herf: string
}> = {
  COMMENT: {
    message: 'commented on your post',
    icon: 'fluent:comment-20-filled',
    class: 'text-primary',
    herf: `/post/${props.notificationData.post?.id}`,
  },
  LIKE: {
    message: 'liked your post',
    icon: 'fluent:heart-20-filled',
    class: 'text-red-500',
    herf: `/post/${props.notificationData.post?.id}`,
  },
  FOLLOW: {
    message: 'followed you',
    icon: 'fluent:person-20-filled',
    class: 'text-primary',
    herf: `/users/${props.notificationData.issuer.username}`,
  },
  MENTION: {
    message: 'mentioned you',
    icon: 'fluent:mention-20-filled',
    class: 'text-primary',
    herf: `/post/${props.notificationData.post?.id}`,
  },
}

const { message, icon, class: notificationClass, herf } = notificationTypeMap[props.notificationData.type]
</script>

<template>
  <NuxtLink
    :to="herf"
    class="block"
  >
    <article
      :class="cn(
        'flex gap-3 rounded-2xl bg-card border p-6 transition-colors hover:bg-card/70',
        !notificationData.isRead && 'bg-primary/10',
      )"
    >
      <Icon :name="icon" :class="cn(notificationClass, 'text-3xl')" />
      <div class="flex flex-col gap-y-3 flex-1">
        <div class="flex items-center">
          <UserAvatar
            :avatar-url="props.notificationData.issuer.avatar"
            :size="36"
          />
          <NuxtTime
            class="ml-auto"
            :datetime="new Date(notificationData.createdAt)"
            relative
            numeric="auto"
            relative-style="long"
          />
        </div>
        <div class="space-x-1">
          <span class="font-bold">{{ props.notificationData.issuer.fullName }}</span>
          <span>{{ message }}</span>
        </div>
        <div
          v-if="notificationData.type === 'LIKE' && notificationData.post"
          class="line-clamp-3 whitespace-pre-line text-muted-foreground"
        >
          <Linkify :content="notificationData.post.content" />
        </div>
        <div
          v-if="notificationData.type === 'COMMENT' && notificationData.comment"
          class="line-clamp-3 whitespace-pre-line text-muted-foreground"
        >
          <Linkify :content="notificationData.comment.content" />
        </div>
        <div
          v-if="notificationData.type === 'MENTION' && notificationData.post && !notificationData.comment"
          class="line-clamp-3 whitespace-pre-line text-muted-foreground"
        >
          <Linkify :content="notificationData.post.content" />
        </div>
        <div
          v-if="notificationData.type === 'MENTION' && notificationData.comment"
          class="line-clamp-3 whitespace-pre-line text-muted-foreground"
        >
          <Linkify :content="notificationData.comment.content" />
        </div>
      </div>
    </article>
  </NuxtLink>
</template>
