<script lang="ts" setup>
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'

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
          <div class="flex flex-col gap-6 bg-card border rounded-2xl p-6">
            <div class="flex gap-6">
              <Skeleton class="hidden sm:block size-12 shrink-0 rounded-full" />
              <div class="relative w-full max-w-full overflow-x-auto">
                <Skeleton class="w-full h-12 rounded-2xl" />
              </div>
            </div>
            <div class="flex justify-end items-center gap-3">
              <Skeleton class="w-6 h-6 rounded-full" />
              <Skeleton class="w-18 h-10 px-4 py-2" />
            </div>
          </div>
        </template>
      </ClientOnly>
      <div>
        <TabsRoot default-value="for-you-feed">
          <TabsList class="w-full">
            <TabsTrigger value="for-you-feed">
              For You
            </TabsTrigger>
            <TabsTrigger value="following-feed">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you-feed">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following-feed">
            <FollowingFeed />
          </TabsContent>
        </TabsRoot>
      </div>
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
