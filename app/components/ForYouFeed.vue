<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query'

// Fetch the posts for the for-you feed
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  useInfiniteQuery({
    queryKey: ['posts-feed', 'for-you-feed'],
    queryFn: async ({ pageParam }) => {
      const url = pageParam ?
        `/api/posts/for-you-feed/${pageParam}` :
        '/api/posts/for-you-feed/:cursorDate'

      return await $fetch<PostPageType>(url)
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

// Flatten the pages of posts into a single array
const posts = computed(() => data.value?.pages.flatMap(page => page.posts) ?? [])
</script>

<template>
  <!-- Show loading skeleton while fetching posts -->
  <PostsLoadingSkeleton v-if="status === 'pending'" />
  <!-- Show message if no posts are available -->
  <p v-else-if="status === 'success' && !posts.length && !hasNextPage"
    class="text-center text-muted-foreground min-h-screen">
    No one has posted yet.
  </p>
  <!-- Show posts if available -->
  <InfiniteScrollContainer v-else class="space-y-6" :has-next-page="hasNextPage" :loading="isFetchingNextPage"
    @load-more="fetchNextPage">
    <Post v-for="post in posts" :key="post.id" :post="post" />
    <div class="flex justify-center">
      <Spinner v-if="isFetchingNextPage" :size="24" />
    </div>
  </InfiniteScrollContainer>
</template>
