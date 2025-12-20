<script lang="ts" setup>
import 'vue-sonner/style.css'
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="oklch(0.488 0.243 264.376)" :height="5" />
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="bottom-right" rich-colors />
  </div>
</template>

<style>

</style>
