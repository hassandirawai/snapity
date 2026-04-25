<script lang="ts" setup>
const { params } = useRoute()

const { user: _loggedInUser } = useUserSession()

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

// const username = computed(() => postData.value?.user?.username)

/*
const { data: userData } = useQuery({
  queryKey: computed(() => ['user', username.value]),
  queryFn: () => $fetch<UserDataType>(`/api/users/user/username/${username.value}`),
  initialData: () => postData.value?.user,
  enabled: computed(() => !!username.value),
})
*/

watchEffect(() => {
  // console.warn('postData:', postData.value)
  // console.warn('userData:', userData.value)

  if (postData.value?.user) {
    useHead({
      title: `${postData.value.user.fullName} (@${postData.value.user.username})`,
      titleTemplate: '%s | Snapity',
    })
  }
})
</script>

<template>
  <main class="flex w-full gap-x-6">
    <div class="w-full gap-y-6">
      <Post v-if="postData" :post-data="postData" />
    </div>
    <ClientOnly>
      <UserInfoSidebar
        v-if="postData"
        :user-data="postData.user"
      />
      <template #fallback>
        <div class="sticky top-[5.54rem] w-72 lg:w-80 h-fit hidden md:block flex-none">
          <div class="flex flex-col gap-6 p-6 bg-card border rounded-2xl">
            <Skeleton class="h-6 w-32" />
            <div class="flex items-center gap-3">
              <Skeleton class="size-10 rounded-full" />
              <div class="space-y-1.5">
                <Skeleton class="h-4 w-32" />
                <Skeleton class="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </main>
</template>

<style></style>
