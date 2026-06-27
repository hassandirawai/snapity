<script lang="ts" setup>
const { user: loggedInUser } = useUserSession()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <div class="mx-auto max-w-7xl px-3 py-6 flex w-full gap-x-6 flex-1">
      <MenuBar
        v-if="loggedInUser"
        class="sticky top-20 border rounded-2xl h-fit p-3 hidden sm:block lg:px-6 xl:w-80"
      />

      <div
        v-else
        class="h-fit p-3 hidden sm:block lg:px-6 xl:w-80"
      />
      <slot />
    </div>
    <MenuBar
      v-if="loggedInUser"
      class="sticky bottom-0 left-0 w-full flex justify-around gap-3 border-t bg-card p-3 sm:hidden"
    />
  </div>
</template>

<style></style>
