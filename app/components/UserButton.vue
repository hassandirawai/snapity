<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { loggedInUser, signOut } = useAuthStore()

const queryClient = useQueryClient()

async function handleSignOut() {
  queryClient.clear()
  await signOut()
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger :class="cn('flex rounded-full', props.class)">
      <ClientOnly>
        <UserAvatar :size="40" :avatar-url="loggedInUser?.image" />
      </ClientOnly>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>
        Logged in as <span class="font-semibold">@{{ loggedInUser?.username }}</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <NuxtLink :to="`/users/${loggedInUser?.username}`">
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
        <Icon name="solar:logout-outline" class="text-lg" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style></style>
