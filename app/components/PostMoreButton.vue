<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  post: PostType
  class?: HTMLAttributes['class']
}>()

const { user: loggedInUser } = useUserSession()

// Generate post link
const postLink = ref(`http://localhost:3000/post/${props.post.id}`)
const { copy } = useClipboard({ source: postLink.value })
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button size="icon" variant="ghost" :class="props.class">
        <Icon name="fluent:more-horizontal-20-regular" class="text-muted-foreground" size="24" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DialogTrigger as-child>
        <DropdownMenuItem v-if="loggedInUser?.id === post.authorId">
          <span class="flex gap-3 items-center text-destructive">
            <Icon name="fluent:delete-20-regular" size="18" />
            Delete
          </span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DropdownMenuItem @click="copy(postLink)">
        <Icon name="fluent:copy-select-20-regular" size="18" />
        Copy Link
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style></style>
