<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { toast } from 'vue-sonner'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const form = useForm({
  validationSchema: toTypedSchema(signUpSchema),
})

const isLoading = ref<boolean>(false)

const onSubmit = form.handleSubmit(async (values) => {
  await signUp.email({
    name: '',
    username: values.username,
    email: values.email,
    password: values.password,
  }, {
    onSuccess: async () => {
      await navigateTo('/')
    },
    onError: () => {
      isLoading.value = false
      toast.error('Please check your username or email address')
    },
    onRequest: () => {
      isLoading.value = true
    },
  })
})
</script>

<template>
  <Card :class="cn('overflow-hidden p-0', props.class)">
    <CardContent class="grid p-0 md:grid-cols-2">
      <form class="flex flex-col gap-6 relative p-6 md:p-8" @submit="onSubmit">
        <div class="flex flex-col items-start justify-center">
          <h1 class="text-2xl font-bold">
            Join <span class="text-primary italic">Snapity</span>
          </h1>
          <p class="text-balance text-muted-foreground">
            Create your account and start sharing.
          </p>
        </div>
        <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!form.isFieldDirty">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Username" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!form.isFieldDirty">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Email" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!form.isFieldDirty">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput placeholder="Password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <LoadingButton type="submit" :loading="isLoading">
          Sign Up
        </LoadingButton>
        <div
          class="relative text-sm text-center after:absolute after:border-t after:border-border after:top-1/2 after:w-full after:z-0 after:flex"
        >
          <span class="relative z-10 bg-card px-2 text-muted-foreground">
            Or Continue With
          </span>
        </div>
        <!-- Social SignUp -->
        <div class="grid grid-cols-3 gap-4">
          <Button variant="outline" class="w-full text-lg hover:*:text-primary">
            <Icon name="mage:apple" />
            <span class="sr-only">Login with Apple</span>
          </Button>
          <Button variant="outline" class="w-full text-lg hover:*:text-primary">
            <Icon name="mage:google" />
            <span class="sr-only">Login with Google</span>
          </Button>
          <Button variant="outline" class="w-full text-lg hover:*:text-primary">
            <Icon name="mage:meta" />
            <span class="sr-only">Login with Meta</span>
          </Button>
        </div>
        <div class="text-center text-sm">
          Already have an account?
          <NuxtLink to="/login" class="underline underline-offset-2">
            Login
          </NuxtLink>
        </div>
      </form>
      <div class="relative hidden bg-muted md:block">
        <img
          src="/sign-up-from-image.jpeg"
          alt="Image"
          class="h-full w-full object-cover"
        >
        <div class="absolute inset-0 bg-black/25" />
        <div class="absolute bottom-8 left-8 right-8">
          <p class="text-white text-xl font-medium">
            Snapity is where your moments come alive.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style>
.x1::after {
  top: 50%;
  width: 100%;
  z-index: 0;
  display: flex;
  justify-content: center;
  border-top: 1px solid gray;
  content: '';
}
</style>
