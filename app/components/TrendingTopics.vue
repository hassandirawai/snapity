<script lang="ts" setup>
const { data: hashtags, pending: _loadingHashtags } = useFetch('/api/hashtags/trending-hashtags')
</script>

<template>
  <div class="w-full space-y-6 p-6 border rounded-2xl">
    <div class="text-lg font-bold">
      Trending Topics
    </div>
    <div class="flex flex-col gap-3">
      <NuxtLink v-for="hashtag in hashtags" :key="hashtag.id" :to="`/hashtag/${hashtag.tag}`" class="block"
        :title="hashtag.tag">
        <p class="line-clamp-1 break-all hover:underline hover:cursor-pointer">
          #{{ hashtag.tag }}
        </p>
        <span class="text-muted-foreground text-sm block">
          {{ formatNumber(hashtag.postsCount) }}
          {{ hashtag.postsCount < 2 ? 'post' : 'posts' }} </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style></style>
