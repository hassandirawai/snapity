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
</script>

<template>
  <NuxtImg
    v-if="avatarUrl"
    :src="avatarUrl"
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

<style>

</style>
