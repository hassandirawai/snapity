<script lang="ts" setup>
defineProps<{
  post: PostType
}>()

const isOpen = ref(false)
const { mutate, isPending } = useDeletePostMutation()
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
        <LoadingButton
          variant="destructive"
          :disabled="isPending"
          :loading="isPending"
          @click="mutate(post.id, {
            onSuccess: () => {
              isOpen = false
            },
          })"
        >
          Submit
        </LoadingButton>
        <DialogClose as-child>
          <Button variant="outline" :disabled="isPending">
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style>

</style>
