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
      <div class="flex gap-x-3">
        <UserTooltip :user-data="postData.user">
          <NuxtLink
            :to="`/users/${postData.user.username}`"
            class="hover:underline"
          >
            <UserAvatar
              :avatar-url="postData.user?.avatar"
              class="sm:inline"
            />
          </NuxtLink>
        </UserTooltip>
        <div class="flex flex-col">
          <UserTooltip :user-data="postData.user">
            <NuxtLink
              :to="`/users/${postData.user.username}`"
              class="block font-medium hover:underline hover:cursor-pointer"
            >
              {{ postData.user.fullName }}
            </NuxtLink>
          </UserTooltip>
          <NuxtLink
            :to="`/post/${postData.post.id}`"
            class="hover:underline hover:cursor-pointer"
          >
            <NuxtTime
              class="text-sm text-muted-foreground"
              :datetime="postData.post.createdAt"
              date-style="long"
              :relative="relative(new Date(postData.post.createdAt))"
            />
          </NuxtLink>
        </div>
      </div>
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

      <!-- Attachments -->
      <MediaPreviews
        v-if="postData.post.attachments"
        :attachments="postData.post.attachments"
      />
      <Separator />
    </div>

    <div class="flex justify-start items-center gap-3">
      <!-- Likes -->
      <Button variant="ghost">
        <Icon
          name="fluent:heart-20-regular"
          class="text-xl"
        />
        <span class="flex items-center">
          {{ postData.post.likesCount }} likes
        </span>
      </Button>
      <!-- Comments -->
      <Button variant="ghost">
        <Icon
          name="fluent:comment-20-regular"
          class="text-xl"
        />
        <span class="flex items-center">
          2 comments
        </span>
      </Button>
      <Button variant="ghost" class="ml-auto">
        <Icon
          name="fluent:bookmark-20-regular"
          class="text-xl"
        />
      </Button>
    </div>
  </article>
</template>
