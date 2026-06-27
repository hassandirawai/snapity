<script lang="ts" setup>
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  await nextTick()
  loading.value = false
})
</script>

<template>
  <main class="flex w-full min-w-0 gap-6">
    <div v-if="loading" class="w-full flex items-center justify-center py-20">
      <div class="flex items-center gap-3">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
        <span class="text-sm">Loading feed...</span>
      </div>
    </div>

    <div v-else class="w-full flex flex-col space-y-6">
      <LazyPostsEditor />
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
          <LazyForYouFeed />
        </TabsContent>
        <TabsContent value="following-feed">
          <LazyFollowingFeed />
        </TabsContent>
      </Tabs>
    </div>

    <LazyTrendsSidebar />
  </main>
</template>
