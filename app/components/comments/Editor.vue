<script lang="ts" setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'

interface CommentInputProps {
  postData: PostDataType
}
const props = defineProps<CommentInputProps>()

const editor = useEditor({
  extensions: [
    createStarterKitExtension(),
    createPlaceholderExtension('Write a comment'),
    createMentionExtension(),
    createMentionExtension(),
  ],
})

const { mutate, isPending } = useSubmitCommentMutation(props.postData.post.id)

function onSubmit() {
  const commentContent = editor.value?.getJSON()
  if (!commentContent) {
    return
  }

  mutate(commentContent, {
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
  <div class="flex w-full items-center gap-2">
    <div class="relative w-full">
      <EditorContent
        :editor="editor"
        class="comment-editor"
      />
      <MentionList />
    </div>
    <LoadingButton
      size="icon"
      variant="ghost"
      :disabled="!editor?.getText().trim()"
      :loading="isPending"
      @click="onSubmit"
    >
      <Icon
        name="fluent:send-20-regular"
        class="text-xl"
      />
    </LoadingButton>
  </div>
</template>

<style>
.comment-editor .tiptap {
  min-height: 2rem;
  max-height: 20rem;
  overflow-y: auto;
  width: 100%;
  min-width: 0;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--input);
  background-color: transparent;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: var(--foreground);
  transition-property: color, background-color, border-color, box-shadow;
  transition-timing-function: ease;
  transition-duration: 150ms;
  outline: none;
}

.dark .comment-editor .tiptap {
  background-color: color-mix(in oklch, var(--input) 30%, transparent);
}

.comment-editor .tiptap:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent);
}

.comment-editor .tiptap p {
  margin: 0;
}
</style>
