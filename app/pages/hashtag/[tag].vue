<script lang="ts" setup>
const route = useRoute()
const { data: posts } = await useFetch<PostType[]>(`/api/posts/hashtag/${route.params.tag}`)
</script>

<template>
  <main class="flex w-full gap-x-6">
    <div class="w-full flex flex-col gap-6 overflow-y-hidden">
      <div class="space-y-6">
        <Post v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
    <TrendsSidebar />
  </main>
</template>

<style>

</style>
