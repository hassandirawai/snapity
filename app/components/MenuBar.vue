<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="props.class">
    <Button
      variant="ghost"
      title="Home"
      class="flex items-center justify-start gap-3"
      as-child
    >
      <NuxtLink to="/">
        <Icon name="fluent:home-20-regular" class="text-xl text-muted-foreground" />
        <span class="hidden lg:inline">Home</span>
      </NuxtLink>
    </Button>
    <Button
      variant="ghost"
      title="Notifications"
      class="flex items-center justify-start gap-3"
      as-child
    >
      <NuxtLink to="/notifications">
        <Icon name="fluent:alert-20-regular" class="text-xl text-muted-foreground" />
        <span class="hidden lg:inline">Notifications</span>
      </NuxtLink>
    </Button>
    <Button
      variant="ghost"
      title="Messages"
      class="flex items-center justify-start gap-3"
      as-child
    >
      <NuxtLink to="/messages">
        <Icon name="fluent:mail-20-regular" class="text-xl text-muted-foreground" />
        <span class="hidden lg:inline">Messages</span>
      </NuxtLink>
    </Button>
    <Button
      variant="ghost"
      title="Bookmarks"
      class="flex items-center justify-start gap-3"
      as-child
    >
      <NuxtLink to="/bookmarks">
        <Icon name="fluent:bookmark-20-regular" class="text-xl text-muted-foreground" />
        <span class="hidden lg:inline">Bookmarks</span>
      </NuxtLink>
    </Button>
  </div>
</template>

<style>

</style>
