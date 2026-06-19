<script lang="ts" setup>
useSeoMeta({
  title: 'Home',
  description: 'Snapity is a social media platform that allows users to connect with each other and share their thoughts, ideas, and experiences.',
})
</script>

<template>
  <main class="flex w-full min-w-0 gap-6">
    <div class="w-full flex flex-col space-y-6">
      <ClientOnly>
        <PostsEditor />
        <template #fallback>
          <Skeleton class="p-6 w-full h-32" />
        </template>
      </ClientOnly>
      <div>
        <ForYouFeed />
      </div>
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
