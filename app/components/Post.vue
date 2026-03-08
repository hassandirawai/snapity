<script lang="ts" setup>
defineProps<{
  postData: PostDataType
}>()

function relative(from: Date): boolean {
  const currentTime = new Date()
  const computerOldestTime = 24 * 60 * 60 * 1000
  if (currentTime.getTime() - from.getTime() < computerOldestTime)
    return true

  return false
}
</script>

<template>
  <article class="group/post flex flex-col gap-3 bg-card border rounded-2xl p-6">
    <div class="flex justify-between items-center">
      <UserTooltip :user-data="postData.user">
        <NuxtLink
          :to="`/users/${postData.user.username}`"
          class="hover:underline"
        >
          <div class="flex items-center gap-3">
            <UserAvatar
              :avatar-url="postData.user?.avatar"
              class="sm:inline"
            />
            <div class="flex flex-col">
              <h1>{{ postData.user.fullName }}</h1>
              <NuxtTime
                class="text-sm text-muted-foreground"
                :datetime="postData.post.createdAt"
                date-style="long"
                :relative="relative(new Date(postData.post.createdAt))"
              />
            </div>
          </div>
        </NuxtLink>
      </UserTooltip>
      <ClientOnly>
        <DeletePostDialog :post-data="postData">
          <PostMoreButton
            :post-data="postData"
            class="sm:opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        </DeletePostDialog>
      </ClientOnly>
    </div>

    <!-- ✅ Post content with clickable hashtags -->
    <div class="flex flex-col gap-3">
      <p class="whitespace-pre-line wrap-break-word">
        <Linkify :content="postData.post.content" />
      </p>
      <Separator />
    </div>

    <div class="flex justify-start items-center gap-3">
      <!-- Likes -->
      <div class="flex items-center gap-1">
        <Icon
          name="fluent:heart-20-regular"
          class="text-xl"
        />
        <span class="flex items-center">
          {{ postData.post.likesCount }} likes
        </span>
      </div>
      <!-- Comments -->
      <div class="flex items-center gap-1">
        <Icon
          name="fluent:comment-20-regular"
          class="text-xl"
        />
        <span class="flex items-center">
          {{ postData.post.disLikesCount }} comments
        </span>
      </div>
      <Icon
        name="fluent:bookmark-20-regular"
        class="text-xl ml-auto"
      />
    </div>
  </article>
</template>
