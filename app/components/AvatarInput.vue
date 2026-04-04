<script lang="ts" setup>
import imageCompression from 'browser-image-compression'

const props = defineProps<{
  src: string | null
}>()

const emits = defineEmits<{
  (e: 'update:avatar', value: File): void
}>()

const isCropDialogOpen = ref<boolean>(false)
const imageToCrop = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement>()
const previewAvatarUrl = ref<string | null>(props.src)

const computedSrc = computed<string | null>(() => {
  if (!previewAvatarUrl.value) {
    return null
  }
  if (previewAvatarUrl.value.startsWith('http')) {
    return props.src
  }
  if (previewAvatarUrl.value.startsWith('blob')) {
    return previewAvatarUrl.value
  }
  return `images/${props.src}`
})

async function onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement

  if (!input.files?.[0]) {
    return
  }

  const file = input.files[0]

  const compressedFile = await imageCompression(file, {
    maxWidthOrHeight: 1024,
    fileType: 'image/webp',
    initialQuality: 1,
    useWebWorker: true,
  })

  imageToCrop.value = URL.createObjectURL(compressedFile)

  isCropDialogOpen.value = true
}

function handleCropped(croppedImage: File) {
  if (!fileInputRef.value)
    return

  emits('update:avatar', croppedImage)
  previewAvatarUrl.value = URL.createObjectURL(croppedImage)
}
</script>

<template>
  <input
    ref="fileInputRef"
    type="file"
    accept="image/*"
    class="hidden sr-only"
    @change="onAvatarSelected"
  >
  <button
    type="button"
    class="relative group/uploadbutton block w-fit h-fit mx-auto md:mx-0 border-2 border-secondary rounded-full"
    @click="fileInputRef?.click()"
  >
    <NuxtImg
      v-if="computedSrc"
      :src="computedSrc"
      alt="User avatar"
      class="aspect-square h-fit flex-none rounded-full object-cover"
      width="148"
      height="148"
      unoptimized
    />
    <NuxtImg
      v-else
      src="/avatar.jpeg"
      alt="User avatar"
      class="aspect-square h-fit flex-none rounded-full object-cover"
      width="148"
      height="148"
      unoptimized
    />
    <div class="absolute bottom-0 -right-[-10%] size-fit flex bg-black/40 p-1 rounded-full group-hover/uploadbutton:scale-125 transition-transform">
      <Icon
        name="fluent:camera-20-regular"
        class="text-white text-2xl"
      />
    </div>
  </button>
  <ImageCropperDialog
    v-model:open="isCropDialogOpen"
    :src="imageToCrop"
    @close="imageToCrop = null"
    @cropped="handleCropped"
  />
</template>
