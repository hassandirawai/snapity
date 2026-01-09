<script lang="ts" setup>

const { data: users } = await useFetch('/api/users/5/', {
  method: 'GET'
})
</script>

<template>
  <div class="w-full space-y-6 p-6 border rounded-2xl">
    <div class="text-lg font-bold">
      Who To Follow
    </div>
    <div class="space-y-3">
      <div v-for="user in users" :key="user.id" class="flex items-center justify-between">
        <NuxtLink :to="`/users/${user.username}`" class="flex items-center gap-x-3">
          <UserAvatar :avatar-url="user.avatar" />
          <div>
            <p class="line-clamp-1 break-all hover:underline hover:cursor-pointer">
              {{ user.name }}
            </p>
            <span class="text-muted-foreground line-clamp-1 break-all">@{{ user.username }}</span>
          </div>
        </NuxtLink>
        <FollowButton :user-id="user.id" :initial-state="{
          followers: user.followers.length,
          isFollowedByUser: user.followers.some((followerId) => followerId === user.id),
        }" />
      </div>
    </div>
  </div>
</template>

<style></style>
