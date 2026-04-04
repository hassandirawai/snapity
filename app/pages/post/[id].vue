<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'

const { params } = useRoute()

const { user: loggedInUser } = useUserSession()

const { data: postData } = await useAsyncData(
  `post_page-${params.id}`,
  async () => {
    try {
      const fetch = useRequestFetch()
      return fetch<PostDataType>(`/api/posts/${params.id}`, {
        method: 'GET',
      })
    }
    catch (error: any) {
      throw createError({
        statusCode: error.statusCode,
        message: 'The post could not be found.',
      })
    }
  },
)

const username = computed(() => postData.value?.user?.username)

const { data: userData } = useQuery({
  queryKey: computed(() => ['user', username.value]),
  queryFn: () => $fetch<UserDataType>(`/api/users/user/username/${username.value}`),
  initialData: () => postData.value?.user,
  enabled: computed(() => !!username.value),
})

watchEffect(() => {
  console.warn('postData:', postData.value)
  console.warn('userData:', userData.value)

  if (postData.value?.user) {
    useHead({
      title: `${postData.value.user.fullName} (@${postData.value.user.username})`,
      titleTemplate: '%s | Snapity',
    })
  }
})
</script>

<template>
  <main
    v-if="loggedInUser"
    class="flex w-full gap-x-6"
  >
    <div class="w-full gap-y-6">
      <Post
        v-if="postData"
        :post-data
      />
    </div>
    <Suspense>
      <UserInfoSidebar
        v-if="userData"
        :user-data="userData"
      />
      <template #fallback>
        <div class="space-y-1.5">
          <Skeleton class="h-4 w-100" />
          <Skeleton class="h-4 w-90" />
        </div>
      </template>
    </Suspense>
  </main>
</template>

<style></style>
