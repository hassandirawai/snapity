import type { InfiniteData, InvalidateQueryFilters, QueryFilters, QueryKey } from '@tanstack/vue-query'
import type { JSONContent } from '@tiptap/core'
import type { CommentDataType, CommentsPageType } from '~~/shared/types/post'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

// Mutation to submit a post
export function useSubmitPostMutation() {
  const queryClient = useQueryClient()

  const { user: loggedInUser } = useUserSession()

  const mutation = useMutation({
    mutationFn: useSubmitPost,
    onSuccess: async (createdPost) => {
      const queryFilter = {
        queryKey: ['posts-feed'],
        predicate(query) {
          return query.queryKey.includes('for-you-feed')
            || (query.queryKey.includes('user-posts-feed')
              && query.queryKey.includes(loggedInUser.value?.id))
        },
      } satisfies QueryFilters

      console.warn('PostSubmitMutation:onSuccess:', createdPost.post.content)

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostsPageType, Date | null>>(
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
          return queryFilter.predicate(query) && !query.state.data
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

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostsPageType, Date | null>>(
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

      toast.success('Post deleted successfully')
    },

    onError: () => {
      toast.error('Failed to delete post')
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
      const userPostsQueryFilter: InvalidateQueryFilters = {
        queryKey: ['posts-feed'],
      }

      const userCommentsQueryFilter: InvalidateQueryFilters = {
        queryKey: ['comments-feed'],
      }

      // console.error('mutation:uploadAvatar', uploadedAvatar?.avatar)

      await queryClinet.cancelQueries(userPostsQueryFilter)

      queryClinet.setQueriesData<InfiniteData<PostsPageType, Date | null>>(
        userPostsQueryFilter,
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

      queryClinet.setQueriesData<InfiniteData<CommentsPageType, Date | null>>(
        userCommentsQueryFilter,
        (oldData) => {
          if (!oldData) {
            return
          }

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(pages => ({
              nextCursor: pages.nextCursor,
              commentsData: pages.commentsData.map((commentData) => {
                if (commentData.user.id === updatedUser.id) {
                  return {
                    comment: {
                      ...commentData.comment,
                    },
                    user: {
                      ...updatedUser,
                      avatar: uploadedAvatar?.avatar || commentData.user.avatar,
                    },
                  }
                }
                return commentData
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

// Mutation to submit a comment
export function useSubmitCommentMutation(postId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (commentContent: JSONContent) => {
      return await $fetch<CommentDataType>(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: { commentContent },
      })
    },
    onSuccess: async (commentData) => {
      const queryKey: QueryKey = ['comments-feed', postId]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData<InfiniteData<CommentsPageType, Date | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0]

          console.warn('commentMutation:', commentData)

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  commentsData: [
                    commentData,
                    ...firstPage.commentsData,
                  ],
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
        queryKey,
        predicate: (query) => {
          return !query.state.data
        },
      })

      toast.success('Comment has been posted')
    },
    onError: (error) => {
      console.error('Failed to create comment', error.message)
      toast.error('Failed to create comment, please try again')
    },
  })

  return mutation
}

// Mutation to delete a comment
export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string
      commentId: string
    }) =>
      $fetch<CommentDataType>(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      }),
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ['comments-feed', deletedComment.comment.postId]

      await queryClient.cancelQueries({
        queryKey,
      })

      queryClient.setQueryData<InfiniteData<CommentsPageType, Date | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) {
            return
          }

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(page => ({
              commentsData: page.commentsData.filter(commentData => commentData.comment.id !== deletedComment.comment.id),
              nextCursor: page.nextCursor,
            })),
          }
        },
      )

      toast.success('Comment deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to delete comment', error.message)
      toast.error('Failed to delete comment, please try again')
    },
  })

  return mutation
}
