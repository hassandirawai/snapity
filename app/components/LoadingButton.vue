<script lang="ts" setup>
import type { ButtonProps } from './ui/button/Button.vue'
import { cn } from '~/lib/utils'

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingIconSize?: number | string
}

const props = withDefaults(defineProps<LoadingButtonProps>(), {
  loading: false,
  loadingIconSize: 24,
})
</script>

<template>
  <Button
    :variant="variant"
    :size="size"
    :class="cn(props.class)"
  >
    <Spinner
      v-if="loading"
      :size="loadingIconSize"
    />
    <slot v-if="!loading" />
  </Button>
</template>

<style></style>
