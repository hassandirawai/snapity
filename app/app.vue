<script lang="ts" setup>
import 'vue-sonner/style.css'
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="oklch(0.488 0.243 264.376)" :height="5" />
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <Toaster position="bottom-right" rich-colors />
    </ClientOnly>
  </div>
</template>

<style></style>
