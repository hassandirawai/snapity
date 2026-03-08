<script lang="ts" setup>
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
  handleUploadFiles,
  isUploading,
  totalProgress,
  removeAttachment,
  reset,
} = await useMediaUpload()

async function onSubmit() {
  const postContent = editor.value?.getText() || ''

  mutate(postContent, {
    onSuccess: () => {
      editor.value?.commands.clearContent()
    },
  })
}

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col gap-6 bg-card border rounded-2xl p-6">
      <div class="flex gap-6">
        <UserAvatar
          :avatar-url="loggedInUser?.avatar"
          class="hidden sm:inline"
        />
        <div class="w-full max-w-full overflow-x-auto">
          <TiptapEditorContent
            :editor="editor"
            class="max-h-80 w-full max-w-full overflow-y-auto bg-accent rounded-2xl p-3"
          />
        </div>
      </div>
      <AttachmentsPreview :attachments />
      <div class="flex justify-end gap-3">
        <UploadAttachmentButton
          :disabled="isUploading || attachments.length >= 5"
          @on-files-selected="handleUploadFiles"
        />
        <LoadingButton
          size="lg"
          :disabled="!editor?.getText().trim() || isPending || !attachments.length"
          :loading="isPending"
          @click="onSubmit"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  </ClientOnly>
</template>

<style></style>
