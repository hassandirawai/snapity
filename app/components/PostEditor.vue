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

async function onSubmit() {
  const postContent = editor.value?.getText() || ''

  mutate(postContent, {
    onSuccess: () => {
      editor.value?.commands.clearContent()
    },
  })
}
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col gap-6 bg-card border rounded-2xl p-6">
      <div class="flex gap-6">
        <UserAvatar :avatar-url="loggedInUser?.avatar" class="hidden sm:inline" />
        <div class="w-full max-w-full overflow-x-auto">
          <TiptapEditorContent :editor="editor"
            class="max-h-80 w-full max-w-full overflow-y-auto bg-accent rounded-2xl p-3" />
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <Button variant="ghost" size="lg" :disabled="!editor?.getText().trim()">
          <Icon icon="fluent:image-add-20-regular" class="text-3xl text-primary" />
        </Button>
        <LoadingButton size="lg" :disabled="!editor?.getText().trim() || isPending" :loading="isPending"
          @click="onSubmit">
          Post
        </LoadingButton>
      </div>
    </div>
  </ClientOnly>
</template>

<style></style>
