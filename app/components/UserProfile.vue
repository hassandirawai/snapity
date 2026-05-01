<script lang="ts" setup>
const { userData, loggedInUserId } = defineProps<{
  userData: UserDataType
  loggedInUserId: string
}>()

const followerInfo: FollowerInfo = {
  followersCount: userData.followersCount,
  isFollowedByUser: userData.isFollowedByUser,
}
</script>

<template>
  <div class="flex flex-col bg-card border rounded-2xl items-center p-6 gap-y-6">
    <UserAvatar
      :avatar-url="userData.avatar"
      :size="192"
    />
    <div class="flex w-full justify-between">
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold">
          {{ userData.fullName }}
        </h1>
        <p class="text-muted-foreground">
          @{{ userData.username }}
        </p>
      </div>
      <!-- Since it does not required any seo will render it on the client side -->
      <ClientOnly>
        <FollowButton
          v-if="userData.id !== loggedInUserId"
          :user-id="userData.id"
          :initial-state="followerInfo"
        >
          Follow
        </FollowButton>
        <EditUserProfileButton
          v-else
          :user-data
        />
      </ClientOnly>
    </div>
    <div class="w-full space-y-3">
      <p>Member since {{ formatRelativeDate(new Date(userData.createdAt)) }}</p>
      <div class="flex gap-x-3">
        <span>
          Posts:
          <span class="font-semibold">
            {{ userData.postsCount }}
          </span>
        </span>
        <FollowerCount
          :user-id="userData.id"
          :initial-state="followerInfo"
        />
      </div>
    </div>
    <div
      v-if="userData.bio"
      class="w-full space-y-3"
    >
      <Separator />
      <p class="whitespace-pre-line wrap-break-word">
        <Linkify :content="userData.bio" />
      </p>
    </div>
  </div>
</template>

<style></style>
