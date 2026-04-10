<script lang="ts" setup>
import { toast } from 'vue-sonner'
import { cn } from '~/lib/utils'

const { user: loggedInUser } = useUserSession()

const editor = useEditor({
  extensions: [
    TiptapStarterKit.configure({
      bold: false,
      italic: false,
    }),
    TiptapPlaceholder.configure({
      placeholder: 'Write your post content here',
    }),
  ],
})

const { mutate, isPending } = useSubmitPostMutation()

const {
  attachments,
  handleUploadFiles: handleUploadFilesServer,
  isUploading,
  totalProgress,
  removeAttachment,
  reset: resetMediaUpload,
} = await useMediaUpload()

const dropZoneRef = useTemplateRef('dropZoneRef')

const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: types => types.some(t => t.startsWith('image/') || t.startsWith('video/')),
  multiple: true,
  onDrop: (files) => {
    if (!files) {
      toast.error('No files dropped')
      return
    }

    handleUploadFilesClient(files)
  },
})

function onPaste(event: ClipboardEvent) {
  const files = Array.from(event.clipboardData?.files ?? [])
    .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))

  if (files.length) {
    handleUploadFilesClient(files)
  }
}

const croppedFiles = ref<File[]>([])
const isCropDialogOpen = ref<boolean>(false)

function handleUploadFilesClient(files: File[]) {
  if (files[0]?.type.startsWith('video/')) {
    handleUploadFilesServer(files)
    return
  }

  croppedFiles.value = files
  isCropDialogOpen.value = true
}

async function onSubmit() {
  const postContent = editor.value?.getText() || ''

  console.warn('Post attachmets:', ...attachments.value.map(attachment => attachment.mediaId).filter(Boolean) as string[])

  mutate({
    content: postContent,
    mediaIds: attachments.value.map(attachment => attachment.mediaId).filter(Boolean) as string[],
  }, {
    onSuccess: () => {
      editor.value?.commands.clearContent()
      resetMediaUpload()
    },
    onError: () => {
      resetMediaUpload()
    },
  })
}

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})

watchEffect(() => {
  // console.warn(...attachments.value)
})
</script>

<template>
  <div
    ref="dropZoneRef"
    class="flex flex-col gap-6 bg-card border rounded-2xl p-6"
  >
    <div class="flex gap-6">
      <UserAvatar
        :avatar-url="loggedInUser!.avatar"
        class="hidden sm:inline"
      />
      <div class="w-full max-w-full overflow-x-auto">
        <TiptapEditorContent
          :editor="editor"
          :class="cn('max-h-80 w-full max-w-full overflow-y-auto bg-accent rounded-2xl p-3', isOverDropZone && 'border-2 border-dashed border-primary')"
          @paste="onPaste"
        />
      </div>
    </div>
    <AttachmentPreviews
      v-if="attachments.length"
      :attachments
      @remove-attachment="(attachment) => {
        removeAttachment(attachment.id)
      }"
    />
    <div class="flex justify-end items-center gap-3">
      <div v-if="isUploading" class="flex gap-3 items-center">
        <span class="text-sm">{{ totalProgress }}%</span>
        <Spinner size="20" class="text-primary" />
      </div>
      <UploadAttachmentButton
        :disabled="isUploading || attachments.length >= 5"
        @on-files-selected="handleUploadFilesClient"
      />
      <LoadingButton
        size="lg"
        :disabled="!editor?.getText().trim() || isUploading"
        :loading="isPending"
        @click="onSubmit"
      >
        Post
      </LoadingButton>
    </div>
  </div>
  <PostImageCropperDialog
    v-model:open="isCropDialogOpen"
    :files="croppedFiles"
    @cropped="handleUploadFilesServer"
  />
</template>

<style></style>
