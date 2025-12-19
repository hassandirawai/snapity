<script lang="ts" setup>
const props = defineProps<{
  userId: string
  initialState: FollowerInfo
}>()

const { data } = useFollowerInfo(props.userId, props.initialState)
</script>

<template>
  <span>
    Followers:
    <span class="font-semibold">
      {{ data.followers }}
    </span>
  </span>
</template>

<style>

</style>
