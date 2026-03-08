<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{ content: string }>()

const parts = computed(() => {
  return props.content.split(
    /(https?:\/\/\S+|@\w+|#\w+)/g,
  ).filter(item => Boolean(item))
})
</script>

<template>
  <span>
    <template
      v-for="(part, index) in parts"
      :key="`${part}-${index}`"
    >
      <a
        v-if="part.startsWith('http')"
        :href="part"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary underline"
      >
        {{ part }}
      </a>

      <UserMentionWithTooltip
        v-else-if="part.startsWith('@')"
        :username="part.slice(1)"
      />

      <NuxtLink
        v-else-if="part.startsWith('#')"
        :to="`/hashtag/${part.slice(1)}`"
        class="text-primary hover:underline"
      >
        {{ part }}
      </NuxtLink>

      <span v-else>
        {{ part }}
      </span>
    </template>
  </span>
</template>
