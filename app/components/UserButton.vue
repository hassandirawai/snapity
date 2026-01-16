<script lang="ts" setup>
import { useQueryClient } from '@tanstack/vue-query';
import type { HTMLAttributes } from 'vue'
import { toast } from 'vue-sonner';
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { user, clear } = useUserSession()

const queryClient = useQueryClient()

async function handleSignOut() {
  try {
    await clear()
    queryClient.clear()
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
    toast.error('An error occurred during logout')
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger :class="cn('flex rounded-full', props.class)">
      <UserAvatar :size="40" :avatar-url="user?.avatar" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>
        Logged in as <span class="font-semibold">@{{ user?.username }}</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <NuxtLink :to="`/users/${user?.username}`">
          <Icon name="fluent:person-20-regular" class="text-lg" />
          Profile
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem v-if="$colorMode.value === 'light'" @click="$colorMode.preference = 'dark'">
        <Icon name="fluent:weather-moon-20-regular" class="text-lg" />
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem v-if="$colorMode.value === 'dark'" @click="$colorMode.preference = 'light'">
        <Icon name="fluent:weather-sunny-20-regular" class="text-lg" />
        Light
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleSignOut">
        <Icon name="fluent:sign-out-20-regular" class="text-lg" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style></style>
