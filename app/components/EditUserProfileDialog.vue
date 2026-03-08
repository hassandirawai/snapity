<script lang="ts" setup>
import { toast } from 'vue-sonner'

const { userData } = defineProps<{
  userData: UserDataType
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const croppedAvatar = ref<File | null>(null)

const form = useForm({
  validationSchema: toTypedSchema(updateUserDataSchema),
  initialValues: {
    fullName: userData.fullName,
    bio: userData.bio || undefined,
  },
  keepValuesOnUnmount: true,
})

const mutation = useUpdateProfileMutation()

async function handleUpdateAvatar(file: File) {
  croppedAvatar.value = file
}

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true

  mutation.mutate(
    {
      values,
      avatar: croppedAvatar.value || undefined,
    },
    {
      onSuccess: async () => {
        toast.success('Profile updated successfully')
        isLoading.value = false
        isOpen.value = false
        form.resetForm({
          values: {
            fullName: '',
            bio: '',
          },
        })
      },
      onError: (error) => {
        toast.error('Failed to update profile', { description: (error as Error).message })
        isLoading.value = false
      },
    },
  )
})

function onPointerDownOutside(event: Event) {
  const target = event.target as HTMLElement

  // Ignore clicks on Sonner toasts
  if (target.closest('[data-sonner-toast]')) {
    event.preventDefault()
  }
}

watch(isOpen, (value) => {
  // console.warn(value)
  emit('update:open', value)
  if (!value) {
    form.setValues({
      fullName: userData.fullName,
      bio: userData.bio || undefined,
    }, false)
  }
})
</script>

<template>
  <Dialog
    v-model:open="isOpen"
    @update:open="() => {

    }"
  >
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent
      class="gap-9"
      @pointer-down-outside="onPointerDownOutside"
    >
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <AvatarInput :src="userData.avatar" @update:avatar="handleUpdateAvatar" />
      <form
        class="flex flex-col gap-6"
        @submit.prevent="onSubmit"
      >
        <FormField
          v-slot="{ componentField }"
          name="fullName"
        >
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="text"
                placeholder="John Doe"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="bio"
        >
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Write something about yourself..."
                v-bind="componentField"
                class="h-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <LoadingButton
            type="submit"
            :loading="isLoading"
          >
            Save
          </LoadingButton>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style></style>
