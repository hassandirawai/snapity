<script lang="ts" setup>
const { user, loggedInUserId } = defineProps<{
  user: UserProfile
  loggedInUserId: string
}>()

const followerInfo: FollowerInfo = {
  followers: user.followersCount,
  isFollowedByUser: user.followers.includes(loggedInUserId),
}
</script>

<template>
  <div class="flex flex-col border rounded-2xl items-center p-6 gap-y-6">
    <UserAvatar :avatar-url="user.avatar" :size="192" />
    <div class="flex w-full justify-between">
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold">
          {{ user.fullName }}
        </h1>
        <p class="text-muted-foreground">
          @{{ user.username }}
        </p>
      </div>
      <FollowButton v-if="user.id !== loggedInUserId" :user-id="user.id" :initial-state="followerInfo">
        Follow
      </FollowButton>
      <Button v-else variant="secondary">
        Edit Profile
      </Button>
    </div>
    <div class="w-full space-y-3">
      <p>Member since {{ formatRelativeDate(new Date(user.createdAt)) }}</p>
      <div class="flex gap-x-3">
        <span>
          Posts:
          <span class="font-semibold">
            {{ user.postsCount }}
          </span>
        </span>
        <FollowerCount :user-id="user.id" :initial-state="followerInfo" />
      </div>
    </div>
    <Separator />
    <p class="w-full">
      Certificated 10x dev and creator of #Snapity
    </p>
  </div>
</template>

<style></style>
