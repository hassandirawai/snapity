<script lang="ts" setup>
const { params } = useRoute()

const { data: fetchedUserData } = useAsyncData(
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

const { user: loggedInUser } = useUserSession()

const computedAvatarUrl = computed(() => {
  // console.warn('computedAvatarUrl:', props.avatarUrl)
  if (!fetchedUserData.value?.avatar) {
    return null
  }
  if (fetchedUserData.value.avatar.startsWith('https')) {
    return fetchedUserData.value.avatar
  }

  return `/images/${fetchedUserData.value.avatar}`
})

useSeoMeta({
  title: () => fetchedUserData.value
    ? `${fetchedUserData.value.fullName} (@${fetchedUserData.value.username})`
    : 'User',
  titleTemplate: '%s | Snapity',
  description: () => fetchedUserData.value?.bio
    || `${fetchedUserData.value?.fullName ?? ''} on Snapity. ${fetchedUserData.value?.postsCount ?? 0} posts.`,
  ogTitle: () => fetchedUserData.value
    ? `${fetchedUserData.value.fullName} (@${fetchedUserData.value.username})`
    : undefined,
  ogDescription: () => fetchedUserData.value?.bio || 'View this profile on Snapity',
  ogImage: computedAvatarUrl,
  twitterCard: 'summary',
})
</script>

<template>
  <main
    v-if="fetchedUserData"
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
      <!-- Show user posts if available -->
      <UserPosts :user-id="fetchedUserData?.id" />
    </div>
    <ClientOnly>
      <template #fallback>
        <div class="block min-w-72 lg:min-w-80" />
      </template>

      <TrendsSidebar />
    </ClientOnly>
  </main>
</template>

<style></style>
