<script lang="ts" setup>
const route = useRoute()

const { data: userInfo, error, status } = await useFetch<UserProfile>(
  `/api/users/user/username/${route.params.username}`,
  { method: 'GET' },
)

if (error.value && status.value === 'error') {
  throw createError({
    statusCode: error.value.statusCode,
    message: 'The user could not be found.',
  })
}

if (userInfo) {
  useHead({
    title: `${userInfo.value?.fullName} (@${userInfo.value?.username})`,
    titleTemplate: '%s | Snapity',
  })
}
</script>

<template>
  <AuthState>
    <template #default="{ loggedIn, user: loggedInUser }">
      <main v-if="loggedIn && !error && userInfo && status === 'success'" class="flex w-full gap-x-6">
        <div class="flex flex-col w-full gap-6">
          <!-- Show user profile if available -->
          <UserProfile :user="userInfo" :logged-in-user-id="loggedInUser!.id" />
          <div class="rounded-2xl min-h-12 bg-muted flex items-center justify-center">
            <h2 class="text-lg font-bold">
              {{ userInfo.fullName }}'s Posts
            </h2>
          </div>
          <ClientOnly>
            <!-- Show user posts if available -->
            <!-- <UserPosts :user-id="userInfo?.id" /> -->
          </ClientOnly>
        </div>
        <TrendsSidebar />
      </main>
    </template>
    <template #placeholder>
      <p class="text-destructive">
        You are not authorized to view this page.
      </p>
    </template>
  </AuthState>
</template>

<style></style>
