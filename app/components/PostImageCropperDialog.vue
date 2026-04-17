<script lang="ts" setup>
import type { Boundaries, ImageSize } from 'vue-advanced-cropper'
import { Cropper, RectangleStencil } from 'vue-advanced-cropper'
import { toast } from 'vue-sonner'
import 'vue-advanced-cropper/dist/style.css'

const { files, open } = defineProps<{
  files: File[]
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
  (e: 'cropped', files: File[]): void
}>()

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const cropperContainerRef = ref<HTMLElement | null>(null)

const { width: containerWidth } = useElementSize(cropperContainerRef)

const ratioOptions = [
  { label: '4:5', ratio: 4 / 5, icon: 'fluent:phone-20-regular' },
  { label: '1:1', ratio: 1, icon: 'fluent:square-20-regular' },
  { label: '16:9', ratio: 16 / 9, icon: 'fluent:rectangle-landscape-20-regular' },
]

const selectedRatio = ref(ratioOptions[0])

interface ImageEntry {
  id: string
  file: File
  src: string
  thumbnailSrc: string
  cropped: boolean
  croppedFile: File | null
}

const imageEntries = ref<ImageEntry[]>([])
const activeEntryIndex = ref<number>(0)

const cropperRenderKey = computed(
  () => `${selectedRatio.value?.label}-${activeEntryIndex.value}-${Math.round(containerWidth.value)}`,
)

watch(() => files, (newFiles) => {
  imageEntries.value = newFiles.map(file => ({
    id: crypto.randomUUID(),
    file,
    src: URL.createObjectURL(file),
    thumbnailSrc: URL.createObjectURL(file),
    cropped: false,
    croppedFile: null,
  }))
  activeEntryIndex.value = 0
})

watch(() => open, (newOpen) => {
  if (newOpen) {
    activeEntryIndex.value = 0
    selectedRatio.value = ratioOptions[0]
  }
})

watch(selectedRatio, () => {
  imageEntries.value.forEach((entry) => {
    entry.cropped = false
    entry.croppedFile = null
  })
})

async function handleSavePreviousCroppedImageOnSwitch(index: number) {
  if (index === activeEntryIndex.value)
    return
  await handleCrop()
  activeEntryIndex.value = index
}

function handleCrop(index?: number): Promise<void> {
  return new Promise((resolve) => {
    const cropperResult = cropperRef.value?.getResult()
    if (!cropperResult?.canvas) {
      resolve()
      return
    }

    cropperResult.canvas.toBlob((blob) => {
      if (!blob) {
        resolve()
        return
      }

      const file = new File([blob], 'attachmentImage.webp', { type: 'image/webp' })
      const activeImageEntry = imageEntries.value[index ?? activeEntryIndex.value]

      if (!activeImageEntry) {
        resolve()
        return
      }

      activeImageEntry.croppedFile = file
      activeImageEntry.cropped = true
      resolve()
    }, 'image/webp')
  })
}

function handleAutoCrop(file: File, ratio: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const imgRatio = img.width / img.height
      let srcX = 0
      let srcY = 0
      let srcWidth = img.width
      let srcHeight = img.height

      if (imgRatio > ratio) {
        srcWidth = srcHeight * ratio
        srcX = (img.width - srcWidth) / 2
      }
      else {
        srcHeight = srcWidth / ratio
        srcY = (img.height - srcHeight) / 2
      }

      const canvas = document.createElement('canvas')
      canvas.width = Math.round(srcWidth)
      canvas.height = Math.round(srcHeight)
      const ctx = canvas.getContext('2d')

      if (!ctx)
        return

      ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        if (!blob)
          return
        resolve(new File([blob], 'attachmentImage.webp', { type: 'image/webp' }))
      }, 'image/webp')
    }

    img.onerror = reject
    img.src = url
  })
}

function removeImageEntry(index: number) {
  const entry = imageEntries.value[index]
  if (!entry)
    return

  URL.revokeObjectURL(entry.thumbnailSrc)
  imageEntries.value.splice(index, 1)

  if (!imageEntries.value.length) {
    handleCloseDialog()
    return
  }

  activeEntryIndex.value = Math.min(activeEntryIndex.value, imageEntries.value.length - 1)
}

const isProcessing = ref(false)

async function handleSubmit() {
  isProcessing.value = true
  try {
    await handleCrop()

    const ratio = selectedRatio.value?.ratio
    if (!ratio)
      return

    const results = await Promise.all(
      imageEntries.value.map(entry =>
        entry.cropped && entry.croppedFile
          ? Promise.resolve(entry.croppedFile)
          : handleAutoCrop(entry.file, ratio),
      ),
    )

    emit('cropped', results)
    handleCloseDialog()
  }
  catch (error: any) {
    toast.error(error.message)
  }
  finally {
    isProcessing.value = false
  }
}

const isOpen = computed({
  get: () => open,
  set: value => emit('update:open', value),
})

function handleCloseDialog() {
  imageEntries.value.forEach((entry) => {
    URL.revokeObjectURL(entry.src)
    URL.revokeObjectURL(entry.thumbnailSrc)
  })
  emit('update:open', false)
  emit('close')
}

function defaultSize({ imageSize }: { imageSize: ImageSize }) {
  if (!imageSize.width || !imageSize.height)
    return { width: 300, height: 375 }

  const ratio = selectedRatio.value?.ratio
  if (!ratio)
    return { width: 300, height: 375 }

  if (imageSize.width / imageSize.height > ratio) {
    return { width: imageSize.height * ratio, height: imageSize.height }
  }
  return { width: imageSize.width, height: imageSize.width / ratio }
}

function stencilSize({ boundaries }: { boundaries: Boundaries }) {
  if (!boundaries.width || !boundaries.height)
    return { width: 300, height: 375 }

  const ratio = selectedRatio.value?.ratio
  if (!ratio)
    return { width: 300, height: 375 }

  if (boundaries.width / boundaries.height > ratio) {
    return { width: boundaries.height * ratio, height: boundaries.height }
  }
  return { width: boundaries.width, height: boundaries.width / ratio }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-4 sm:p-6">
      <DialogHeader>
        <DialogTitle>Crop Images</DialogTitle>
        <DialogDescription>
          Select a photo below, choose an aspect ratio, then crop.
        </DialogDescription>
      </DialogHeader>

      <!-- Aspect ratio selector -->
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Button
          v-for="ratioOption in ratioOptions"
          :key="ratioOption.label"
          :variant="selectedRatio?.ratio === ratioOption.ratio ? 'outline' : 'secondary'"
          size="sm"
          @click="selectedRatio = ratioOption"
        >
          <Icon :name="ratioOption.icon" class="text-base" />
          {{ ratioOption.label }}
        </Button>
      </div>

      <!-- Cropper -->
      <div
        ref="cropperContainerRef"
        class="relative mx-auto flex w-full max-w-md flex-1 justify-center overflow-hidden rounded-2xl"
        :style="{ aspectRatio: String(selectedRatio?.ratio ?? 4 / 5), minHeight: 'min(18rem, 45dvh)' }"
      >
        <Cropper
          v-if="imageEntries[activeEntryIndex]"
          :key="cropperRenderKey"
          ref="cropperRef"
          class="avatar-cropper size-full"
          :src="imageEntries[activeEntryIndex]?.src"
          :stencil-component="RectangleStencil"
          :stencil-props="{
            aspectRatio: selectedRatio?.ratio,
            borderRadius: 20,
            movable: false,
            scalable: false,
            lines: {},
            handlers: {},
            previewClass: 'avatar-cropper-stencil',
          }"
          :min-width="10"
          :min-height="10"
          :stencil-size="stencilSize"
          :default-size="defaultSize"
          :debounce="false"
          image-restriction="stencil"
        />
      </div>

      <!-- Thumbnail strip -->
      <div class="flex gap-3 px-1 py-2">
        <div
          v-for="(imageEntry, index) in imageEntries"
          :key="imageEntry.id"
          class="relative flex-none cursor-pointer"
          @click="handleSavePreviousCroppedImageOnSwitch(index)"
        >
          <img
            :src="imageEntry.thumbnailSrc"
            alt="Thumbnail"
            width="72"
            height="72"
            class="size-18 rounded-2xl object-cover transition-all"
            :class="activeEntryIndex === index ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-90'"
          >
          <Button
            variant="ghost"
            size="icon"
            class="absolute -right-1.5 -top-1.5 size-4.5 rounded-full bg-destructive text-background"
            @click.stop="removeImageEntry(index)"
          >
            <Icon name="fluent:dismiss-12-filled" class="text-xs" />
          </Button>
        </div>
      </div>

      <DialogFooter class="mt-auto flex-col-reverse gap-2 sm:flex-row">
        <Button variant="outline" :disabled="isProcessing" @click="handleCloseDialog">
          Cancel
        </Button>
        <LoadingButton :loading="isProcessing" @click="handleSubmit">
          Done
        </LoadingButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
