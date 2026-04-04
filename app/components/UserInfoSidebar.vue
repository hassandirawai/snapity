<script lang="ts" setup>
defineProps<{
  userData: UserDataType
}>()
</script>

<template>
  <div class="sticky top-[5.54rem] w-72 lg:w-80 h-fit hidden md:block flex-none">
    <div class="flex flex-col gap-y-6 p-6 bg-card border rounded-2xl">
      <div class="text-lg font-bold">
        Who To Follow
      </div>
      <div class="flex flex-col gap-y-3">
        <UserTooltip :user-data="userData">
          <NuxtLink
            :to="`/users/${userData.username}`"
            class="flex items-center gap-x-3"
          >
            <UserAvatar :avatar-url="userData.avatar" />
            <div>
              <p class="line-clamp-1 break-all hover:underline hover:cursor-pointer">
                {{ userData.fullName }}
              </p>
              <span class="text-muted-foreground line-clamp-1 break-all">@{{ userData.username }}</span>
            </div>
          </NuxtLink>
        </UserTooltip>

        <p
          v-if="userData.bio"
          class="whitespace-pre-line wrap-break-word"
        >
          <Linkify :content="userData.bio" />
        </p>
      </div>
    </div>
  </div>
</template>
