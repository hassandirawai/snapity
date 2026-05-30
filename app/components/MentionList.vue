<script setup lang="ts">
const { state } = useMentionDropdown()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="state.isOpen"
      class="p-1 fixed z-50 w-80 overflow-hidden rounded-2xl border bg-popover shadow-xl"
      :style="{
        left: `${state.x}px`,
        top: `${state.y}px`,
      }"
    >
      <div class="flex justify-center">
        <Spinner
          v-if="state.isLoading"
          :size="24"
        />
      </div>

      <div
        v-if="!state.isLoading && !state.items.length"
        class="p-4 text-sm text-muted-foreground"
      >
        No users found
      </div>

      <div v-if="!state.isLoading">
        <button
          v-for="(item, index) in state.items"

          :key="item.id"
          type="button"
          class="rounded-2xl flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent"
          :class="index === state.selectedIndex && 'bg-accent'"
          @mouseenter="state.selectedIndex = index"
          @mousedown.prevent="state.command?.(item)"
        >
          <UserAvatar
            :avatar-url="item.avatar"
            class="size-10 shrink-0"
          />

          <div class="min-w-0 flex flex-col">
            <span class="truncate font-medium text-foreground">
              {{ item.fullName }}
            </span>

            <span class="truncate text-sm text-muted-foreground">
              @{{ item.username }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </Teleport>
</template>
