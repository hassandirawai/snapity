<script lang="ts" setup>

</script>

<template>
  <div class="flex gap-3 rounded-2xl bg-card border p-6">
    <!-- Notification action icon -->
    <Skeleton class="hidden sm:block size-10 shrink-0 rounded-full" />
    <div class="flex flex-col gap-y-3 w-full">
      <div class="flex items-center">
        <!-- User avatar -->
        <Skeleton class="hidden sm:block size-10 shrink-0 rounded-full" />
        <!-- Notification created at -->
        <Skeleton class="ml-auto h-4 w-36" />
      </div>
      <!-- Notification message -->
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full" />
    </div>
  </div>
</template>

<style>

</style>
