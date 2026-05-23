<script lang="ts" setup>
import type { ButtonProps } from './ui/button/Button.vue'
import { cn } from '~/lib/utils'

interface CommentButtonProps extends ButtonProps {
  postData: PostDataType
}

const props = defineProps<CommentButtonProps>()

const emits = defineEmits<{
  (e: 'showComments'): void
}>()
</script>

<template>
  <button
    :class="cn('flex items-center gap-2', props.class)"
    @click="emits('showComments')"
  >
    <Icon
      name="fluent:comment-20-regular"
      class="text-xl"
    />
    <span class="space-x-1">
      {{ postData.post.commentsCount }}
      <span class="hidden sm:inline">comments</span>
    </span>
  </button>
</template>
