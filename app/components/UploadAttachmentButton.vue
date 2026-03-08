<script lang="ts" setup>
defineProps<{
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'onFilesSelected', files: File[]): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

function handleFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement

  const selectedFiles = Array.from(input.files || [])

  if (selectedFiles.length) {
    emits('onFilesSelected', selectedFiles)
    input.value = ''
  }
}
</script>

<template>
  <input
    ref="fileInputRef"
    type="file"
    accept="image/*, video/*"
    multiple
    class="hidden sr-only"
    @change="handleFilesSelected"
  >
  <Button
    variant="ghost"
    size="lg"
    :disabled
    @click="fileInputRef?.click()"
  >
    <Icon
      name="fluent:image-add-20-regular"
      class="text-3xl text-primary"
    />
  </Button>
</template>
