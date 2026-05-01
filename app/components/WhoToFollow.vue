<script lang="ts" setup>
const { data: usersData } = useFetch<UserDataType[]>('/api/users/5/', {
  method: 'GET',
})
</script>

<template>
  <div class="w-full bg-card space-y-6 p-6 border rounded-2xl">
    <div class="text-lg font-bold">
      Who To Follow
    </div>
    <div class="space-y-3">
      <div
        v-for="userData in usersData"
        :key="userData.id"
        class="flex items-center justify-between"
      >
        <UserTooltip :user-data="userData">
          <NuxtLink
            :to="`/users/${userData.username}`"
            class="flex items-center gap-x-3"
          >
            <UserAvatar :avatar-url="userData.avatar" />
            <div>
              <p class="line-clamp-1 break-all hover:underline hover:cursor-pointer">
                {{ userData.fullName }}
              </p>
              <span class="text-muted-foreground line-clamp-1 break-all">@{{ userData.username }}</span>
            </div>
          </NuxtLink>
        </UserTooltip>
        <ClientOnly>
          <FollowButton
            :user-id="userData.id"
            :initial-state="{
              followersCount: userData.followersCount,
              isFollowedByUser: userData.isFollowedByUser,
            }"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style></style>
