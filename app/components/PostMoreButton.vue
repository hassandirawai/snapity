<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  postData: PostDataType
  class?: HTMLAttributes['class']
}>()

const { user: loggedInUser } = useUserSession()

// Generate post link
const postLink = ref(`${window.location.origin}/post/${props.postData.post.id}`)
const { copy } = useClipboard({ source: postLink })

function handleCopy() {
  copy(postLink.value)
    .then(() => toast.success('Link copied!'))
    .catch(() => toast.error('Failed to copy link!'))
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button
        size="icon"
        variant="ghost"
        :class="props.class"
      >
        <Icon
          name="fluent:more-horizontal-20-regular"
          class="text-muted-foreground"
          size="24"
        />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DialogTrigger as-child>
        <DropdownMenuItem v-if="loggedInUser?.id === props.postData.user.id">
          <span class="flex gap-3 items-center text-destructive">
            <Icon
              name="fluent:delete-20-regular"
              size="18"
            />
            Delete
          </span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DropdownMenuItem @click="handleCopy">
        <Icon
          name="fluent:copy-select-20-regular"
          size="18"
        />
        Copy Link
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style></style>
