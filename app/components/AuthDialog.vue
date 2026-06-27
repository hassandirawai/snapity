<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = defineProps<{
  sourceType: 'COMMENT' | 'LIKE' | 'FOLLOW' | 'BOOKMARK'
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

enum SourceType {
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
  FOLLOW = 'FOLLOW',
  BOOKMARK = 'BOOKMARK',
}

const sourceTypeMap: Record<SourceType, {
  messageTtile: string
  messageDescription: string
  icon: string
  class: string
}> = {
  COMMENT: {
    messageTtile: 'Reply to join the conversation.',
    messageDescription: 'Once you join X, you can respond to saudigamer\'s post.',
    icon: 'fluent:comment-20-filled',
    class: 'text-primary',
  },
  LIKE: {
    messageTtile: 'Like a post to share the love.',
    messageDescription: 'Join X now to let saudigamer know you like their post.',
    icon: 'fluent:heart-20-filled',
    class: 'text-red-500',
  },
  FOLLOW: {
    messageTtile: 'Follow a user to stay updated.',
    messageDescription: 'Stay informed about what\'s happening on Snapity.',
    icon: 'fluent:person-20-filled',
    class: 'text-primary',
  },
  BOOKMARK: {
    messageTtile: 'Don\'t miss what\'s happening',
    messageDescription: 'People on Snapity are the first to know.',
    icon: 'fluent:bookmark-20-filled',
    class: 'text-primary',
  },
}

const { messageTtile, messageDescription, icon, class: className } = sourceTypeMap[props.sourceType]
</script>

<template>
  <Dialog
    :open="isOpen"
    @update:open="emit('close')"
  >
    <DialogContent class="flex flex-col gap-y-9">
      <DialogHeader>
        <DialogTitle class="flex flex-col gap-y-6">
          <Icon
            :name="icon"
            :class="cn('text-3xl', className)"
          />
          <span>{{ messageTtile }}</span>
        </DialogTitle>
        <DialogDescription>
          {{ messageDescription }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-3">
        <Button
          class="w-full"
          as-child
        >
          <NuxtLink to="/login">
            Login
          </NuxtLink>
        </Button>
        <Button
          variant="secondary"
          class="w-full"
          as-child
        >
          <NuxtLink to="/signup">
            Sign Up
          </NuxtLink>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
