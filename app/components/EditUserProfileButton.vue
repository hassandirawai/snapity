<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  userData: UserDataType
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>

<template>
  <EditUserProfileDialog :user-data @update:open="emit('update:open', $event /* Value of the dialog emit event */)">
    <Button
      variant="secondary"
      :class="props.class"
    >
      Edit Profile
    </Button>
  </EditUserProfileDialog>
</template>
