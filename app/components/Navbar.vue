<script lang="ts" setup>
const { user: loggedInUser } = useUserSession()
</script>

<template>
  <header class="sticky top-0 z-10 bg-card border-b">
    <div class="mx-auto max-w-7xl flex items-center justify-between gap-6 px-6 py-3">
      <!-- TODO: Enhance logo size -->
      <!-- TODO: Fix navbar gap flash out suddenly -->
      <NuxtLink to="/">
        <NuxtImg
          src="/sanpity-logo.svg"
          alt="Snapity Logo"
          width="48"
          height="48"
          class="w-28"
        />
      </NuxtLink>
      <SearchField v-if="loggedInUser" />
      <div class="sm:ms-auto">
        <ClientOnly v-if="loggedInUser">
          <UserButton />

          <template #fallback>
            <Skeleton class="w-10 h-10 rounded-full" />
          </template>
        </ClientOnly>

        <Button
          v-else
          as-child
        >
          <NuxtLink to="/login">
            Login
          </NuxtLink>
        </Button>
      </div>
    </div>
  </header>
</template>

<style></style>
