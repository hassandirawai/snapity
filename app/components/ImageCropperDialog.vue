<script lang="ts" setup>
import type { Boundaries, ImageSize } from 'vue-advanced-cropper'
import { CircleStencil, Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps<{
  src: string | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
  (e: 'cropped', file: File): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

function handleCloseDialog() {
  emit('update:open', false)
  emit('close')
}

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

function handleCrop() {
  const cropperResult = cropperRef.value?.getResult()
  if (!cropperResult?.canvas)
    return

  cropperResult.canvas.toBlob((blob) => {
    if (!blob)
      return

    const file = new File([blob], `avatar.webp`, {
      type: 'image/webp',
    })

    emit('cropped', file)
    handleCloseDialog()
  }, 'image/webp')
}

function defaultSize({ imageSize }: { imageSize: ImageSize }) {
  if (!imageSize.width || !imageSize.height) {
    return { width: 200, height: 200 }
  }

  const size = Math.min(imageSize.height, imageSize.width)

  return {
    width: size,
    height: size,
  }
}

function stencilSize({ boundaries }: { boundaries: Boundaries }) {
  if (!boundaries.width || !boundaries.height) {
    return { width: 200, height: 200 }
  }

  const size = Math.min(boundaries.height, boundaries.width)

  return {
    width: size,
    height: size,
  }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Crop Avatar </DialogTitle>
        <DialogDescription>
          Select an area to crop your avatar. Once you're satisfied with the
          selection, click "Crop" to finalize your avatar.
        </DialogDescription>
      </DialogHeader>
      <div class="flex w-full justify-center">
        <Cropper
          v-if="src"
          ref="cropperRef"
          :src="src"
          :stencil-component="CircleStencil"
          :stencil-props="{
            aspectRatio: 4 / 5,
            movable: false,
            scalable: false,
            lines: {},
            handlers: {},
            previewClass: 'avatar-cropper-stencil',
          }"
          :min-width="200"
          :min-height="200"
          :stencil-size="stencilSize"
          :default-size="defaultSize"
          :debounce="false"
          background-class="avatar-cropper-background"
          foreground-class="avatar-cropper-foreground"
          class="avatar-cropper w-96 h-96"
          image-restriction="stencil"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleCloseDialog">
          Cancel
        </Button>
        <Button @click="handleCrop">
          Crop
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style></style>
