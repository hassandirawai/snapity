<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  avatarUrl: string | null | undefined
  size?: number | string
  class?: HTMLAttributes['class']
}>(), {
  size: 48,
})

const computedAvatarUrl = computed(() => {
  // console.warn('computedAvatarUrl:', props.avatarUrl)
  if (!props.avatarUrl) {
    return null
  }
  if (props.avatarUrl.startsWith('https')) {
    return props.avatarUrl
  }

  return `/images/${props.avatarUrl}`
})
</script>

<template>
  <NuxtImg
    v-if="computedAvatarUrl"
    :src="computedAvatarUrl"
    alt="User avatar"
    :width="size || 48"
    :height="size || 48"
    :class="cn('aspect-square h-fit flex-none rounded-full object-cover', props.class)"
  />
  <NuxtImg
    v-else
    src="/avatar.jpeg"
    alt="User avatar"
    :width="size || 48"
    :height="size || 48"
    :class="cn('aspect-square h-fit flex-none rounded-full object-cover', props.class)"
  />
</template>

<style></style>
