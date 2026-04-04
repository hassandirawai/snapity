<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'

const { params } = useRoute()

const { data: fetchedUserData } = await useAsyncData(
  `user-${params.username}`,
  async () => {
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
)

const { data: userData } = useQuery({
  queryKey: computed(() => ['user', fetchedUserData.value?.username]),
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
  initialData: () => fetchedUserData.value,
  staleTime: Infinity,
})

const { user: loggedInUser } = useUserSession()

watchEffect(() => {
  if (userData.value) {
    useHead({
      title: `${userData.value?.fullName} (@${userData.value?.username})`,
      titleTemplate: '%s | Snapity',
    })
  }
})
</script>

<template>
  <main
    v-if="loggedInUser && userData"
    class="flex w-full gap-x-6"
  >
    <div class="flex flex-col w-full gap-6">
      <!-- Show user profile if available -->
      <UserProfile
        :user-data="userData"
        :logged-in-user-id="loggedInUser?.id"
      />
      <div class="rounded-2xl min-h-12 bg-muted flex items-center justify-center">
        <h2 class="text-lg font-bold">
          {{ userData.fullName }}'s Posts
        </h2>
      </div>
      <ClientOnly>
        <!-- Show user posts if available -->
        <UserPosts :user-id="userData?.id" />
      </ClientOnly>
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
