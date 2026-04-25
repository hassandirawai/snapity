<script lang="ts" setup>
const { params } = useRoute()

const { data: fetchedUserData } = await useAsyncData(
  `user-${params.username}`,
  async () => {
    try {
      const fetch = useRequestFetch()
      return await fetch<UserDataType>(`/api/users/user/username/${params.username}`, {
        method: 'GET',
      })
    }
    catch (error: any) {
      throw createError({
        statusCode: error.statusCode,
        message: 'The user could not be found.',
      })
    }
  },
)

/*
const { data: userData } = useQuery({
  queryKey: ['user', params.username],
  queryFn: async () => {
    try {
      return await $fetch<UserDataType>(`/api/users/user/username/${params.username}`, {
        method: 'GET',
      })
    }
    catch (error: any) {
      throw createError({
        statusCode: error.statusCode,
        message: 'The user could not be found.',
      })
    }
  },
  // initialData: () => fetchedUserData.value,
  staleTime: Infinity,
})
*/

const { user: loggedInUser } = useUserSession()

watchEffect(() => {
  if (fetchedUserData.value) {
    useHead({
      title: `${fetchedUserData.value?.fullName} (@${fetchedUserData.value?.username})`,
      titleTemplate: '%s | Snapity',
    })
  }
})
</script>

<template>
  <main
    v-if="loggedInUser && fetchedUserData"
    class="flex w-full gap-x-6"
  >
    <div class="flex flex-col w-full gap-6">
      <!-- Show user profile if available -->
      <UserProfile
        :user-data="fetchedUserData"
        :logged-in-user-id="loggedInUser?.id"
      />
      <div class="rounded-2xl min-h-12 bg-muted flex items-center justify-center">
        <h2 class="text-lg font-bold">
          {{ fetchedUserData.fullName }}'s Posts
        </h2>
      </div>
      <ClientOnly>
        <!-- Show user posts if available -->
        <UserPosts :user-id="fetchedUserData?.id" />
      </ClientOnly>
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
