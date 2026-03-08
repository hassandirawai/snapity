<script lang="ts" setup>
const route = useRoute()
const { data: postsData } = await useFetch<PostDataType[]>(`/api/posts/hashtag/${route.params.tag}`)
</script>

<template>
  <main class="flex w-full gap-x-6">
    <div class="w-full flex flex-col gap-6 overflow-y-hidden">
      <div class="space-y-6">
        <Post
          v-for="postData in postsData"
          :key="postData.post.id"
          :post-data="postData"
        />
      </div>
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
