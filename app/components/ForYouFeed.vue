<script lang="ts" setup>
// Fetch the posts for the for-you feed
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, status } = useInfiniteQuery({
  queryKey: ['posts-feed', 'for-you-feed'],
  queryFn: async ({ pageParam }) => {
    const url = pageParam
      ? `/api/posts/for-you-feed/${pageParam}`
      : `/api/posts/for-you-feed/:cursorDate`

    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    return await $fetch<PostPageType>(url, { headers })
  },
  getNextPageParam: lastPage => lastPage.nextCursor,
  initialPageParam: null as Date | null,
})

// Flatten the pages of posts into a single array
const posts = computed(() => data.value?.pages.flatMap(page => page.posts) ?? [])
</script>

<template>
  <!-- Show loading skeleton while fetching posts -->
  <PostsLoadingSkeleton v-if="status === 'pending'" />
  <!-- Show message if no posts are available -->
  <p
    v-else-if="status === 'success' && !posts.length && !hasNextPage"
    class="text-center text-muted-foreground"
  >
    No one has posted yet.
  </p>
  <!-- Show posts if available -->
  <InfiniteScrollContainer
    v-else
    class="space-y-6"
    :has-next-page="hasNextPage"
    :loading="isFetchingNextPage"
    @load-more="fetchNextPage"
  >
    <Post v-for="post in posts" :key="post.id" :post="post" />
    <div class="flex justify-center">
      <Spinner v-if="isLoading || isFetchingNextPage" :size="24" />
    </div>
  </InfiniteScrollContainer>
</template>
