<script lang="ts" setup>
import type { ButtonProps } from './ui/button/Button.vue'
import { cn } from '~/lib/utils'
import { buttonVariants } from './ui/button'

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
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <Spinner v-if="loading" :size="loadingIconSize" />
    <slot />
  </Button>
</template>

<style>

</style>
