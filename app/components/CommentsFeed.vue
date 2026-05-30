<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query'

interface CommentsFeedProps {
  postData: PostDataType
}

const props = defineProps<CommentsFeedProps>()

const {
  data: commentsPage,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
} = useInfiniteQuery({
  queryKey: ['comments-feed', props.postData.post.id],
  queryFn: async ({ pageParam }) => {
    const url = pageParam
      ? `/api/posts/${props.postData.post.id}/comments-feed/${pageParam}`
      : `/api/posts/${props.postData.post.id}/comments-feed/:cursorDate`

    return await $fetch<CommentsPageType>(url)
  },
  initialPageParam: null as Date | null,
  getNextPageParam: lastPage => lastPage.nextCursor,
})

const commentsData = computed<CommentDataType[]>(() => commentsPage.value?.pages.flatMap(page => page.commentsData) ?? [])
</script>

<template>
  <div class="space-y-3">
    <CommentsEditor :post-data />
    <div class="divide-y">
      <CommentsItem v-for="commentData in commentsData" :key="commentData.comment.id" :comment-data="commentData" />
    </div>
    <div
      v-if="status === 'pending'"
      class="flex justify-center items-center"
    >
      <Spinner :size="24" />
    </div>
    <p
      v-if="status === 'success' && !commentsData.length"
      class="text-muted-forground text-center"
    >
      No comments yet
    </p>
    <p
      v-if="status === 'error'"
      class="text-destructive text-center"
    >
      An error occurred while loading comments
    </p>
    <Button
      v-if="hasNextPage"
      variant="link"
      class="mx-auto block"
      :disabled="isFetchingNextPage"
      @click="fetchNextPage"
    >
      Load more comments
    </Button>
  </div>
</template>
