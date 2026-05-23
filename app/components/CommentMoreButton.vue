<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  commentData: CommentDataType
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
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
        <DropdownMenuItem>
          <span class="flex gap-3 items-center text-destructive">
            <Icon
              name="fluent:delete-20-regular"
              size="18"
            />
            Delete
          </span>
        </DropdownMenuItem>
      </DialogTrigger>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style></style>
