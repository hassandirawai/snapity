<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  size?: number | string
}>(), {
  size: 16,
})
</script>

<template>
  <Icon
    role="status"
    aria-label="Loading"
    name="fluent:spinner-ios-20-filled"
    :class="cn('animate-spin', props.class)"
    :size="props.size"
  />
</template>
