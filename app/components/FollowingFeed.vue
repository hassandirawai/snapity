<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query'

const { user: loggedInUser } = useUserSession()

const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, status } = useInfiniteQuery({
  queryKey: ['posts-feed', 'following-feed'],
  queryFn: async ({ pageParam }) => {
    const url = pageParam
      ? `/api/posts/following-feed/${pageParam}`
      : `/api/posts/following-feed/:cursorDate`

    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    return await $fetch<PostPageType>(url, { headers })
  },
  getNextPageParam: lastPage => lastPage.nextCursor,
  initialPageParam: null as string | null,
  enabled: computed(() => !!loggedInUser.value),
})

const posts = computed(() => data.value?.pages.flatMap(page => page.posts) ?? [])
</script>

<template>
  <!-- Show loading skeleton while fetching posts -->
  <PostsLoadingSkeleton v-if="status === 'pending'" />
  <!-- Show message if no posts are available -->
  <p v-else-if="status === 'success' && !posts.length && !hasNextPage" class="text-center text-muted-foreground">
    No posts found. Start following people to see their posts.
  </p>
  <!-- Show posts if available -->
  <InfiniteScrollContainer v-else class="space-y-6" :has-next-page="hasNextPage" @load-more="fetchNextPage">
    <Post v-for="post in posts" :key="post.id" :post="post" />
    <div class="flex justify-center">
      <Spinner v-if="isLoading || isFetchingNextPage" :size="24" />
    </div>
  </InfiniteScrollContainer>
</template>

<style></style>
