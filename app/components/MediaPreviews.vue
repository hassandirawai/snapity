<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineProps<{
  attachments: MediaType[]
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-3', attachments.length > 1 && 'sm:grid sm:grid-cols-2')">
    <MediaPreview
      v-for="media in attachments"
      :key="media.id"
      :media
    />
  </div>
</template>
