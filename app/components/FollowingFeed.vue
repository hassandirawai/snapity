<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query'

const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, status, refetch } = useInfiniteQuery({
  queryKey: ['posts-feed', 'following-feed'],
  queryFn: async ({ pageParam }) => {
    const url = pageParam
      ? `/api/posts/following-feed/${pageParam}`
      : `/api/posts/following-feed/:cursorDate`

    return await $fetch<PostsPageType>(url, {
      headers: useRequestHeaders(['cookie']),
    })
  },
  getNextPageParam: lastPage => lastPage.nextCursor,
  initialPageParam: null as Date | null,
})

const postsData = computed(() => data.value?.pages.flatMap(page => page.postsData) ?? [])

// Fetch data before component is mounted
onBeforeMount(async () => {
  await refetch()
})
</script>

<template>
  <ClientOnly>
    <!-- Show loading skeleton while fetching posts -->
    <LazyPostsLoadingSkeleton v-if="status === 'pending'" />
    <!-- Show message if no posts are available -->
    <p
      v-else-if="status === 'success' && !postsData.length && !hasNextPage"
      class="text-center text-muted-foreground"
    >
      No posts found. Start following people to see their posts.
    </p>
    <!-- Show posts if available -->
    <InfiniteScrollContainer
      v-else
      class="space-y-6"
      :has-next-page="hasNextPage"
      @load-more="fetchNextPage"
    >
      <PostsItem
        v-for="postData in postsData"
        :key="postData.post.id"
        :post-data="postData"
      />
      <div class="flex justify-center">
        <Spinner
          v-if="isLoading || isFetchingNextPage"
          :size="24"
        />
      </div>
    </InfiniteScrollContainer>
  </ClientOnly>
</template>

<style></style>
