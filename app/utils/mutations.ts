import type { InfiniteData, InvalidateQueryFilters } from '@tanstack/vue-query'

// Mutation to submit a post
export function useSubmitPostMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: useSubmitPost,
    onSuccess: async (createdPost) => {
      const queryFilter: InvalidateQueryFilters = {
        queryKey: ['posts-feed'],
      }

      await queryClient.cancelQueries({ queryKey: ['posts-feed'] })

      queryClient.setQueriesData<InfiniteData<PostPageType, Date | null>>(
        queryFilter,
        (oldData) => {
          // Get first page to add the new post to it
          const firstPage = oldData?.pages[0]

          // Add the created post to the beginning of the first page
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [createdPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            }
          }
        },
      )

      // Invalidate queries if the first page has not being loaded yet
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate: (query) => {
          return !query.state.data
        },
      })
    },
  })

  return mutation
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: useUseDeletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: InvalidateQueryFilters = {
        queryKey: ['posts-feed'],
      }

      await queryClient.invalidateQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostPageType, Date | null>>(
        queryFilter,
        (oldDate) => {
          if (!oldDate)
            return

          return {
            pageParams: oldDate.pageParams,
            pages: oldDate.pages.map(page => ({
              posts: page.posts.filter(post => post.id !== deletedPost.id),
              nextCursor: page.nextCursor,
            })),
          }
        },
      )
    },
  })

  return mutation
}
