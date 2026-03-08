<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query'

const props = defineProps<{
  userId: string | undefined
}>()

const { user: loggedInUser } = useUserSession()

// Fetch the posts for the for-you feed
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, status } = useInfiniteQuery({
  queryKey: ['posts-feed', 'user-posts', props.userId],
  queryFn: async ({ pageParam }) => {
    const url = pageParam
      ? `/api/users/user/${props.userId}/posts/${pageParam}`
      : `/api/users/user/${props.userId}/posts/:cursorDate`

    return await $fetch<PostPageType>(url)
  },
  getNextPageParam: lastPage => lastPage.nextCursor,
  initialPageParam: null as Date | null,
  enabled: computed(() => !!loggedInUser.value && !!props.userId),
  refetchOnMount: true,
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
    class="text-center text-muted-foreground"
  >
    {{ userId === loggedInUser?.id ? 'You don\'t have posts yet.' : 'This user doesn\'t have posts yet.' }}
  </p>
  <!-- Show posts if available -->
  <InfiniteScrollContainer
    v-else
    class="space-y-6"
    :has-next-page="hasNextPage"
    :loading="isFetchingNextPage"
    @load-more="fetchNextPage"
  >
    <Post
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
</template>
