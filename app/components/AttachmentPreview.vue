<script lang="ts" setup>
import type { Attachment } from '~/types/post'
import { cn } from '~/lib/utils'

const { attachment } = defineProps<{
  attachment: Attachment
}>()

const emits = defineEmits<{
  (e: 'onRemoveAttachmentClicked', attachment: Attachment): void
}>()

const src = URL.createObjectURL(attachment.file)
</script>

<template>
  <div :class="cn('relative mx-auto size-fit', attachment.isUploading && 'animate-pulse')">
    <NuxtImg
      v-if="attachment.file.type.startsWith('image')"
      :src
      alt="Post image preview"
      width="500"
      height="500"
      class="size-fit max-h-120 rounded-2xl"
    />
    <video v-else controls class="size-fit max-h-120 rounded-2xl">
      <source :src :type="attachment.file.type">
    </video>
    <Button
      variant="ghost"
      class="absolute left-3 top-3 p-2.5 rounded-full bg-foreground text-background"
      @click="emits('onRemoveAttachmentClicked', attachment)"
    >
      <Icon name="fluent:dismiss-24-filled" class="text-lg" />
    </Button>
  </div>
</template>
