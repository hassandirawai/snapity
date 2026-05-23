<script lang="ts" setup>
interface CommentInputProps {
  postData: PostDataType
}
const props = defineProps<CommentInputProps>()
const commentContent = ref<string>()
const inputRef = useTemplateRef('inputRef')

const { mutate, isPending } = useSubmitCommentMutation(props.postData.post.id)

onMounted(async () => {
  await nextTick()
  inputRef.value?.$el.focus()
})

function onSubmit() {
  if (!commentContent.value) {
    return
  }

  mutate(commentContent.value, {
    onSuccess: () => {
      commentContent.value = ''
    },
  })
}
</script>

<template>
  <form class="flex w-full items-center gap-2" @submit.prevent="onSubmit">
    <div class="flex-1">
      <Input
        ref="inputRef"
        v-model="commentContent"
        placeholder="Write a comment..."
      />
    </div>
    <Button
      type="submit"
      variant="ghost"
      size="icon"
      :disabled="!commentContent?.trim() || isPending"
    >
      <Icon
        v-if="!isPending"
        name="fluent:send-20-regular"
        class="text-xl"
      />
      <Spinner v-else />
    </Button>
  </form>
</template>
