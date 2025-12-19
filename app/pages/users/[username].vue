<script lang="ts" setup>
const route = useRoute()

const { data: userInfo, error, status } = await useFetch<UserInfo>(
  `/api/users/user/username/${route.params.username}`,
  { method: 'GET' },
)

if (error.value && status.value === 'error') {
  throw createError({
    statusCode: error.value.statusCode,
    message: 'The user could not be found.',
  })
}

const { loggedInUser } = useAuthStore()

if (userInfo) {
  useHead({
    title: `${userInfo.value?.name} (@${userInfo.value?.username})`,
    titleTemplate: '%s | Snapity',
  })
}
</script>

<template>
  <p v-if="!loggedInUser" class="text-destructive">
    You are not authorized to view this page.
  </p>
  <main v-else-if="!error && userInfo && status === 'success'" class="flex w-full gap-x-6">
    <div class="flex flex-col w-full gap-6">
      <!-- Show user profile if available -->
      <UserProfile :user="userInfo" :logged-in-user-id="loggedInUser.id" />
      <div class="rounded-2xl h-12 bg-muted flex items-center justify-center">
        <h2 class="text-lg font-bold">
          {{ userInfo.name }}'s Posts
        </h2>
      </div>
      <!-- Show user posts if available -->
      <UserPosts :user-id="userInfo?.id" />
    </div>
    <TrendsSidebar />
  </main>
</template>

<style></style>
