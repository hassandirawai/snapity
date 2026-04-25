<script lang="ts" setup>
useSeoMeta({
  title: 'Bookmarks',
  description: 'View and manage your bookmarks.',
})
</script>

<template>
  <main class="flex w-full min-w-0 gap-6">
    <div class="w-full min-w-0 space-y-6">
      <div class="rounded-2xl bg-muted p-3">
        <h1 class="text-center text-2xl font-bold">
          Bookmarks
        </h1>
      </div>
      <BookmarksFeed />
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
