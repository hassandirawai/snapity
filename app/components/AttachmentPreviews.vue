<script lang="ts" setup>
import type { Attachment } from '~/types/post'
import { cn } from '~/lib/utils'

defineProps<{
  attachments: Attachment[]
}>()

const emits = defineEmits<{
  (e: 'removeAttachment', attachment: Attachment): void
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-3', attachments.length > 1 && 'sm:grid sm:grid-cols-2')">
    <AttachmentPreview
      v-for="attachment in attachments"
      :key="attachment.id"
      :attachment="attachment"
      @on-remove-attachment-clicked="emits('removeAttachment', attachment)"
    />
  </div>
</template>
