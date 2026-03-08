<script lang="ts" setup>
import type { Attachment } from '~/types/post'
import { cn } from '~/lib/utils'

const { attachment } = defineProps<{
  attachment: Attachment
}>()

const emits = defineEmits<{
  (e: 'onRemoveAttachmentClicked', attachment: Attachment): void
}>()

const { id, file, mediaId, isUploading, uploadProgress } = attachment

const src = URL.createObjectURL(file)
</script>

<template>
  <div :class="cn('relative mx-auto size-fit', isUploading && 'animate-pulse opacity-50')">
    <NuxtImg
      v-if="file.type.startsWith('image')"
      :src
      alt="Post image preview"
      width="500"
      height="500"
      class="size-fit max-h-30 rounded-2xl"
    />
    <video v-if="file.type.startsWith('video')" controls>
      <source :src :type="file.type">
    </video>
    <Button
      v-if="isUploading"
      variant="ghost"
      class="absolute left-0 top-0 rounded-full bg-foreground"
      @click="emits('onRemoveAttachmentClicked', attachment)"
    >
      <Icon name="fluent:dismiss-24-filled" />
    </Button>
  </div>
</template>
