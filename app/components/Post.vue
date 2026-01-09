<script lang="ts" setup>
import { NuxtLink } from '#components'

defineProps<{
  post: PostType
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
      <div class="flex items-center gap-3">
        <UserAvatar :avatar-url="post?.authorAvatar" class="sm:inline" />
        <NuxtLink :to="`/users/${post.authorUsername}`" class="hover:underline">
          <h1>{{ post.authorName }}</h1>
          <NuxtTime class="text-sm text-muted-foreground" :datetime="post.postCreatedAt" date-style="long"
            :relative="relative(new Date(post.postCreatedAt))" />
        </NuxtLink>
      </div>
      <ClientOnly>
        <DeletePostDialog :post="post">
          <PostMoreButton :post="post" class="sm:opacity-0 transition-opacity group-hover/post:opacity-100" />
        </DeletePostDialog>
      </ClientOnly>
    </div>

    <!-- ✅ Post content with clickable hashtags -->
    <div class="flex flex-col gap-3">
      <p class="whitespace-pre-line wrap-break-word">
        <template v-for="(part, i) in parseContent(post.postContent)" :key="i">
          <NuxtLink v-if="part.isTag" :to="`/hashtag/${part.text.substring(1)}`" class="text-primary hover:underline">
            {{ part.text }}
          </NuxtLink>
          <span v-else>{{ part.text }}</span>
        </template>
      </p>
      <Separator />
    </div>

    <div class="flex justify-start items-center gap-3">
      <!-- Likes -->
      <div class="flex items-center gap-1">
        <Icon icon="fluent:heart-20-regular" class="text-xl" />
        <span class="flex items-center">
          {{ post.likesCount }} likes
        </span>
      </div>
      <!-- Comments -->
      <div class="flex items-center gap-1">
        <Icon icon="fluent:comment-20-regular" class="text-xl" />
        <span class="flex items-center">
          {{ post.disLikesCount }} comments
        </span>
      </div>
      <Icon icon="fluent:bookmark-20-regular" class="text-xl ml-auto" />
    </div>
  </article>
</template>
