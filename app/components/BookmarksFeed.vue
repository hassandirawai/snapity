<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query'

// Fetch the posts for the for-you feed
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status }
  = useInfiniteQuery({
    queryKey: ['posts-feed', 'bookmarks-feed'],
    queryFn: async ({ pageParam }) => {
      const url = pageParam
        ? `/api/posts/bookmarks-feed/${pageParam}`
        : '/api/posts/bookmarks-feed/:cursorDate'

      return $fetch<PostsPageType>(url, {
        headers: useRequestHeaders(['cookie']),
      })
    },
    initialPageParam: null as Date | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
  })

// Flatten the pages of posts into a single array
const postsData = computed(() => data.value?.pages.flatMap(page => page.postsData) ?? [])
</script>

<template>
  <!-- Show loading skeleton while fetching posts -->
  <PostsLoadingSkeleton v-if="status === 'pending'" />
  <!-- Show message if no posts are available -->
  <p
    v-else-if="status === 'success' && !postsData.length && !hasNextPage"
    class="text-center text-muted-foreground min-h-screen"
  >
    You haven't bookmarked any posts yet.
  </p>
  <!-- Show posts if available -->
  <InfiniteScrollContainer
    v-else
    class="space-y-6"
    :has-next-page="hasNextPage"
    :loading="isFetchingNextPage"
    @load-more="fetchNextPage"
  >
    <PostsItem
      v-for="postData in postsData"
      :key="postData.post.id"
      :post-data="postData"
    />
    <div class="flex justify-center">
      <Spinner
        v-if="isFetchingNextPage"
        :size="24"
      />
    </div>
  </InfiniteScrollContainer>
</template>
