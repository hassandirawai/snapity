<script lang="ts" setup>

</script>

<template>
  <div class="w-full  flex flex-col gap-3 bg-card border rounded-2xl p-6">
    <div class="flex items-center gap-3">
      <!-- User Avatar -->
      <Skeleton class="hidden sm:inline size-12 rounded-full" />
      <div class="space-y-1.5">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>

    <!-- Post content -->
    <div class="space-y-1.5">
      <Skeleton class="h-4 w-100" />
      <Skeleton class="h-4 w-90" />
    </div>
  </div>
</template>

<style>

</style>
