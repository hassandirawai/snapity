<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';

const { params } = useRoute()

const { data: post, isLoading } = useQuery({
  queryKey: ['post'],
  queryFn: async () => await $fetch<PostType>(`/api/posts/${params.id}`),
})
</script>

<template>
  <main class="flex w-full gap-x-6">
    <div class="w-full flex flex-col gap-6 overflow-y-hidden">
      <Post v-if="!isLoading && post" :post="post" />
      <div v-if="isLoading" class="w-full text-center">
        <Spinner :size="24" />
      </div>
    </div>
    <!-- <TrendsSidebar /> -->
  </main>
</template>

<style></style>
