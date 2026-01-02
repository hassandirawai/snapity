<script lang="ts" setup>

</script>

<template>
  <header class="sticky top-0 z-10 bg-card border-b">
    <div class="mx-auto max-w-7xl flex items-center justify-between gap-6 px-6 py-3">
      <!-- TODO: Enhance logo size -->
      <!-- TODO: Fix navbar gap flash out suddenly -->
      <NuxtLink to="/">
        <NuxtImg src="/sanpity-logo.svg" width="96" height="96" class="w-28" />
      </NuxtLink>
      <SearchField />
      <AuthState v-slot="{ loggedIn, clear }">
        <UserButton class="sm:ms-auto" />
      </AuthState>
    </div>
  </header>
</template>

<style>

</style>
