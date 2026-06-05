<script setup lang="ts">
const { state } = useMentionDropdown()

const dropdownRef = useTemplateRef('dropdownRef')

function updatePosition() {
  const cursorPosition = state.value.getReferenceRect?.()

  if (!cursorPosition) {
    return
  }

  // Gap between cursor and dropdown.
  const offset = 8
  const dropdownHeight = dropdownRef.value?.getBoundingClientRect().height ?? 0

  const spaceBelow = window.innerHeight - cursorPosition.bottom
  const spaceAbove = cursorPosition.top

  state.value.x = cursorPosition.left

  const shouldShowAbove
    = spaceBelow < dropdownHeight
      && spaceAbove > spaceBelow

  let y = shouldShowAbove
    ? cursorPosition.top - dropdownHeight - offset
    : cursorPosition.bottom + offset

  y = Math.max(8, y)

  state.value.y = y
}

onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition, true)
})

watch(
  () => [
    state.value.isLoading,
    state.value.items.length,
  ],
  async () => {
    if (!state.value.isOpen) {
      return
    }

    await nextTick()
    updatePosition()
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="state.isOpen"
      ref="dropdownRef"
      class="p-1 fixed z-50 w-80 max-h-[40vh] overflow-y-auto rounded-2xl border bg-popover shadow-xl"
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
