<script lang="ts" setup>
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <div class="mx-auto max-w-7xl px-3 py-6 flex w-full gap-x-6">
      <MenuBar class="sticky top-[5.54rem] border rounded-2xl h-fit p-3 hidden sm:block lg:px-6 xl:w-80" />
      <slot />
    </div>
    <MenuBar class="sticky bottom-0 left-0 w-full flex justify-around gap-3 border-t bg-card p-3 sm:hidden" />
  </div>
</template>

<style>

</style>
