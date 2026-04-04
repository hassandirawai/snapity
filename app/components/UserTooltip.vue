<script lang="ts" setup>
interface UserTooltipProps {
  userData: UserDataType
}

const props = defineProps<UserTooltipProps>()

const isTooltipOpen = ref<boolean>(false)
const isEditProfileDialogOpen = ref<boolean>(false)

const tooltipOpen = computed({
  get: () => isTooltipOpen.value || isEditProfileDialogOpen.value,
  set: (value) => {
    // console.warn(value)
    if (!isEditProfileDialogOpen.value) {
      isTooltipOpen.value = value
    }
  },
})

const { user: loggedInUser } = useUserSession()

const followerInfo = computed<FollowerInfo>(() => ({
  followersCount: props.userData.followersCount,
  isFollowedByUser: props.userData.followers.includes(loggedInUser.value?.id || ''),
}))
</script>

<template>
  <ClientOnly>
    <TooltipProvider>
      <Tooltip v-model:open="tooltipOpen">
        <TooltipTrigger as-child>
          <slot />
        </TooltipTrigger>
        <TooltipContent>
          <div class="flex flex-col gap-3 px-1 py-3 wrap-break-word max-w-80 md:min-w-52">
            <div class="flex items-center justify-between gap-x-3">
              <UserAvatar
                :avatar-url="userData.avatar"
                :size="64"
              />
              <FollowButton
                v-if="userData.id !== loggedInUser?.id"
                class="flex-1"
                :user-id="userData.id"
                :initial-state="followerInfo"
              >
                Follow
              </FollowButton>
              <EditUserProfileButton
                v-else
                :user-data="userData"
                class="flex-1"
                @update:open="(value) => {
                  isEditProfileDialogOpen = value
                  if (!value) {
                    isTooltipOpen = false
                  }
                }"
              />
            </div>
            <div class="space-y-3">
              <div class="flex flex-col">
                <h1 class="text-lg font-bold">
                  {{ userData.fullName }}
                </h1>
                <p class="text-muted-foreground">
                  @{{ userData.username }}
                </p>
              </div>
              <FollowerCount
                :user-id="userData.id"
                :initial-state="followerInfo"
              />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </ClientOnly>
</template>
