<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'

defineOptions({
  inheritAttrs: false,
})
const showPassword = ref(false)
const input = ref<HTMLInputElement | null>(null)

defineExpose({
  input,
})

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="relative">
    <Input
      v-bind="$attrs"
      ref="input"
      :type="showPassword ? 'text' : 'password'"
      class="pe-10"
    />
    <button
      type="button"
      :title="showPassword ? 'Hide password' : 'Show password'"
      class="flex justify-center items-center absolute right-3 top-1/2 -translate-y-1/2 transform"
      @click="togglePassword"
    >
      <Icon
        v-if="!showPassword" name="fluent:eye-20-regular" size="18"
      />
      <Icon
        v-else name="fluent:eye-off-20-regular" size="18"
      />
    </button>
  </div>
</template>
