<script lang="ts" setup>
const query = ref('')

async function handleSubmit() {
  const formattedQuery = computed(() => query.value.trim())
  if (formattedQuery.value) {
    await navigateTo(`/search?query=${encodeURIComponent(formattedQuery.value)}`)
  }
}
</script>

<template>
  <form method="GET" action="/search" @submit.prevent="handleSubmit">
    <div class="relative">
      <Input v-model="query" name="search" placeholder="Search" class="pe-10" />
      <Icon name="fluent:search-24-regular"
        class="absolute text-xl text-muted-foreground top-1/2 right-0 -translate-1/2" />
    </div>
  </form>
</template>

<style></style>
