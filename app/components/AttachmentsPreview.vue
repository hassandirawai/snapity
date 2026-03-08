<script lang="ts" setup>
import type { Attachment } from '~/types/post'

defineProps<{
  attachments: Attachment[]
}>()
</script>

<template>
  <div v-for="attachment in attachments" :key="attachment.id">
    <AttachmentPreview :attachment />
  </div>
</template>
