import type { InfiniteData, InvalidateQueryFilters } from '@tanstack/vue-query'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

// Mutation to submit a post
export function useSubmitPostMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: useSubmitPost,
    onSuccess: async (createdPost) => {
      const queryFilter: InvalidateQueryFilters = {
        queryKey: ['posts-feed'],
      }

      console.warn('PostSubmitMutation:onSuccess:', createdPost.post.content)

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
                  postsData: [createdPost, ...firstPage.postsData],
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

      toast.success('Post created successfully')
    },
    onError: (error) => {
      console.error('Failed to create post', error.message)
      toast.error('Failed to create post')
    },
  })

  return mutation
}

// Mutation for deleting a post
export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: useUseDeletePost,
    onSuccess: async (postData) => {
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
              postsData: page.postsData.filter(data => data.post.id !== postData.post.id),
              nextCursor: page.nextCursor,
            })),
          }
        },
      )

      await refreshNuxtData(`post_page-${postData.post.id}`)
    },
  })

  return mutation
}

// Mutation for updating user profile
export function useUpdateProfileMutation() {
  const queryClinet = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ values, avatar }: { values: UpdateUserDataValues, avatar?: File }) => {
      return Promise.all([
        useUpdateUserProfile(values),
        avatar && useUpdateUserAvatar(avatar),
      ])
    },
    onSuccess: async ([updatedUser, uploadedAvatar]) => {
      const userProfileQueryFilter: InvalidateQueryFilters = {
        queryKey: ['posts-feed'],
      }

      const _userDataQueryFilter: InvalidateQueryFilters = {
        queryKey: ['user', updatedUser.username],
      }

      // console.error('mutation:uploadAvatar', uploadedAvatar?.avatar)

      await queryClinet.cancelQueries(userProfileQueryFilter)

      queryClinet.setQueriesData<InfiniteData<PostPageType, Date | null>>(
        userProfileQueryFilter,
        (oldData) => {
          if (!oldData) {
            return
          }

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(pages => ({
              nextCursor: pages.nextCursor,
              postsData: pages.postsData.map((postData) => {
                if (postData.user.id === updatedUser.id) {
                  return {
                    post: {
                      ...postData.post,
                    },
                    user: {
                      ...updatedUser,
                      avatar: uploadedAvatar?.avatar || postData.user.avatar,
                    },
                  }
                }
                return postData
              }),
            })),
          }
        },
      )

      /*
      queryClinet.setQueryData<UserDataType>(
        ['user', updatedUser.username],
        (oldData) => {
          if (!oldData) {
            return
          }

          return {
            ...oldData, // ✅ keep existing data
            ...updatedUser, // ✅ overwrite only provided fields
            avatar: uploadedAvatar?.avatar || oldData.avatar,
            bio: updatedUser.bio ?? oldData.bio, // ✅ FIX
          }
        },
      )
      */
      // await refreshNuxtData([`user-${updatedUser.username}`])
      await refreshNuxtData()
      const { fetch: fetchUserSession } = useUserSession()
      await fetchUserSession()
    },
    onError(error) {
      console.error(error)
    },
  })

  return mutation
}
