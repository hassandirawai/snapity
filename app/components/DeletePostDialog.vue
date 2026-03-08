<script lang="ts" setup>
import { toast } from 'vue-sonner'

const props = defineProps<{
  postData: PostDataType
}>()

const isOpen = ref<boolean>(false)
const { mutate, isPending } = useDeletePostMutation()

function onDelete() {
  mutate(props.postData.post.id, {
    onSuccess() {
      toast.success('Post deleted successfully')
    },
    onError() {
      toast.error('Failed to delete post')
    },
  })
}
</script>

<template>
  <Dialog
    v-model:open="isOpen"
    @update:open="() => {
      if (isPending) {
        isOpen = true
      }
    }"
  >
    <slot />
    <DialogContent
      @pointer-down-outside="(event) => {
        // Block closing via outside click while pending
        if (isPending) event.preventDefault()
      }"
    >
      <DialogHeader>
        <DialogTitle>
          Delete Post
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this post? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose as-child>
          <Button
            variant="outline"
            :disabled="isPending"
          >
            Cancel
          </Button>
        </DialogClose>
        <LoadingButton
          variant="destructive"
          :disabled="isPending"
          :loading="isPending"
          @click="onDelete"
        >
          Submit
        </LoadingButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style></style>
