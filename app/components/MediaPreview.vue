<script lang="ts" setup>
const props = defineProps<{
  media: MediaType
}>()

const mediaUrl = useMediaPathname(props.media.pathname)
</script>

<template>
  <div v-if="mediaUrl" class="mx-auto size-full">
    <LoadingImage
      v-if="media.type === 'IMAGE'"
      :src="mediaUrl"
      alt="Post image"
      class="size-full mx-auto rounded-2xl object-cover"
    />
    <LoadingVideo
      v-else-if="media.type === 'VIDEO'"
      :src="mediaUrl"
      class="size-full max-h-120 rounded-2xl mx-auto"
    />
    <p
      v-else
      class="text-destructive"
    >
      Unsupported media type of {{ media.type }}
    </p>
  </div>
</template>
