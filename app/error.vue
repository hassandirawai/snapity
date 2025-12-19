<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLoadingIndicator color="oklch(0.488 0.243 264.376)" :height="5" />
  <div class="flex justify-center items-center w-full h-screen">
    <div class="flex flex-col items-center p-6 gap-y-6 border rounded-2xl">
      <h1 class="text-6xl font-bold">
        404
      </h1>
      <p class="text-lg">
        {{ error?.message }}
      </p>
      <Button @click="handleError">
        Go to Homepage
      </Button>
    </div>
  </div>
</template>
