<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  class?: HTMLAttributes['class']
}>()

const hasError = ref<boolean>(false)

function onError() {
  hasError.value = true
}
</script>

<template>
  <NuxtImg
    :key="src"
    v-slot="{ isLoaded, imgAttrs, src: loadedSrc }"
    :src
    custom
  >
    <img
      v-if="isLoaded"
      v-bind="imgAttrs"
      :src="loadedSrc"
      :alt
      :class="props.class"
      @error="onError"
    >

    <Spinner
      v-if="!isLoaded && !hasError"
      size="24"
      class="mx-auto"
    />

    <div v-if="hasError" class="flex items-center justify-center bg-muted text-muted-foreground text-sm rounded-md w-full h-full">
      Failed to load
    </div>
  </NuxtImg>
</template>
