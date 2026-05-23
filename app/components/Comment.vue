<script lang="ts" setup>
interface CommentProps {
  commentData: CommentDataType
}

defineProps<CommentProps>()

function relative(from: Date): boolean {
  const currentTime = new Date()
  const computerOldestTime = 24 * 60 * 60 * 1000
  if (currentTime.getTime() - from.getTime() < computerOldestTime)
    return true

  return false
}

const { user: loggedInUser } = useUserSession()
</script>

<template>
  <div class="group/comment flex gap-3 py-3">
    <span class="hidden sm:inline">
      <UserTooltip :user-data="commentData.user">
        <NuxtLink
          :to="`/users/${commentData.user.username}`"
          class="hover:underline"
        >
          <UserAvatar
            :avatar-url="commentData.user.avatar"
            :size="40"
          />
        </NuxtLink>
      </UserTooltip>
    </span>

    <div>
      <div class="flex items-center gap-1 text-sm">
        <UserTooltip :user-data="commentData.user">
          <NuxtLink
            :to="`/users/${commentData.user.username}`"
            class="block font-medium hover:underline hover:cursor-pointer"
          >
            {{ commentData.user.fullName }}
          </NuxtLink>
        </UserTooltip>
        <NuxtTime
          class="text-muted-foreground"
          :datetime="commentData.comment.createdAt"
          date-style="long"
          :relative="relative(new Date(commentData.comment.createdAt))"
        />
      </div>
      <Linkify :content="commentData.comment.content" />
    </div>

    <ClientOnly>
      <DeleteCommentDialog
        v-if="loggedInUser?.id === commentData.user.id"
        :comment-data
      >
        <CommentMoreButton
          :comment-data
          class="ms-auto sm:opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      </DeleteCommentDialog>
    </ClientOnly>
  </div>
</template>
