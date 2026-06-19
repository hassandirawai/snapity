<script lang="ts" setup>
useSeoMeta({
  title: 'Notifications',
  description: 'View and manage your notifications.',
})
</script>

<template>
  <main class="flex w-full min-w-0 gap-6">
    <div class="w-full min-w-0 space-y-6">
      <div class="rounded-2xl bg-muted p-3">
        <h1 class="text-center text-2xl font-bold">
          Notifications
        </h1>
      </div>
      <NotificationsFeed />
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
