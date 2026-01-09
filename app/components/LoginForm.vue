<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { toast } from 'vue-sonner'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const form = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const isLoading = ref<boolean>(false)

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  const { fetch } = useUserSession()
  try {
    const { success } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: values.username,
        password: values.password,
      },
    })

    if (success) {
      await fetch()
      await navigateTo('/')
      toast.success('Logged in successfully')
    }
  } catch (error: any) {
    console.error('Error:', error.data)
    const errorMessage = error.data || 'Login failed'
    toast.error(errorMessage.data)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <Card :class="cn('overflow-hidden p-0 gap-0', props.class)">
    <CardContent class="grid md:grid-cols-2 p-0">
      <form class="relative p-6 md:p-8 flex flex-col gap-6" @submit="onSubmit">
        <!-- Form Header -->
        <div class="flex flex-col items-start justify-center">
          <h1 class="text-2xl font-bold">
            Welcome back to <span class="text-primary italic">Snapity</span>
          </h1>
          <p class="text-balance text-muted-foreground">
            Log in to continue sharing your moments.
          </p>
        </div>
        <!-- Form Fields -->
        <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!form.isFieldDirty">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Username" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!form.isFieldDirty">
          <FormItem>
            <div class="flex justify-between">
              <FormLabel>Password</FormLabel>
              <NuxtLink to="/resetpassword" class="text-sm underline-offset-2 hover:underline">
                Forgot your password?
              </NuxtLink>
            </div>
            <FormControl>
              <PasswordInput v-bind="componentField" type="password" placeholder="Password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <LoadingButton type="submit" :loading="isLoading">
          Login
        </LoadingButton>
        <!-- Text with Divider -->
        <div
          class="relative text-sm text-center after:absolute after:w-full after:flex after:border-border after:border-t after:top-1/2 after:z-0">
          <span class="relative z-10 text-muted-foreground bg-card px-2">Or Continue With</span>
        </div>
        <!-- Social Login -->
        <div class="grid grid-cols-3 gap-4">
          <Button variant="outline" class="w-full text-lg hover:*:text-primary">
            <Icon icon="mage:apple" />
            <span class="sr-only">Login with Apple</span>
          </Button>
          <Button variant="outline" class="w-full text-lg hover:*:text-primary">
            <Icon icon="mage:google" />
            <span class="sr-only">Login with Google</span>
          </Button>
          <Button variant="outline" class="w-full text-lg hover:*:text-primary">
            <Icon icon="mage:meta" />
            <span class="sr-only">Login with Meta</span>
          </Button>
        </div>
        <div class="text-center text-sm">
          Don't have an account?
          <NuxtLink to="/signup" class="underline underline-offset-2">
            SignUp
          </NuxtLink>
        </div>
      </form>
      <div class="relative hidden bg-muted md:block">
        <img src="/sign-up-from-image.jpeg" alt="Image" class="h-full w-full object-cover">
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

<style></style>
