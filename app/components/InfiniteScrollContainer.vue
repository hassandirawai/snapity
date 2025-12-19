<script lang="ts" setup>
import type { InfiniteData, InfiniteQueryObserverResult } from '@tanstack/vue-query'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class: HTMLAttributes['class']
  // Whether there are more pages to load
  hasNextPage: boolean
  // Whether the load more posts request is in progress
  loading?: boolean
  // Load more posts
  onLoadMore: () => Promise<InfiniteQueryObserverResult<InfiniteData<PostPageType, unknown>, Error>> | Promise<void>
}>()

// Infinite scroll
useInfiniteScroll(
  window,
  async () => {
    if (props.hasNextPage)
      await props.onLoadMore()
  },
  { distance: 200 },
)
</script>

<template>
  <div
    :class="props.class"
  >
    <slot />
  </div>
</template>

<style>

</style>
