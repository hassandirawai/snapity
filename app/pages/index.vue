<script lang="ts" setup>
useSeoMeta({
  title: 'Home',
  description: 'Snapity is a social media platform that allows users to connect with each other and share their thoughts, ideas, and experiences.',
})
</script>

<template>
  <main class="flex w-full min-w-0 gap-6 ">
    <div class="w-full flex flex-col space-y-6">
      <PostEditor class="top-[5.54rem]" />
      <div>
        <Tabs default-value="for-you-feed">
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
        </Tabs>
      </div>
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
