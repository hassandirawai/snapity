<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  src: string
  width?: number | string
  height?: number | string
  class?: HTMLAttributes['class']
}>()

const isLoading = ref<boolean>(true)
const hasError = ref<boolean>(false)

function onError() {
  isLoading.value = false
  hasError.value = true
}
</script>

<template>
  <Spinner
    v-if="isLoading"
    size="24"
    class="mx-auto"
  />

  <div v-if="hasError" class="flex items-center justify-center bg-muted text-muted-foreground text-sm rounded-md w-full h-full">
    Failed to load
  </div>

  <video
    v-show="!isLoading"
    controls
    :class="props.class"
    @loadeddata="isLoading = false"
    @error="onError"
  >
    <source :src>
  </video>
</template>
