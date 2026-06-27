<script lang="ts" setup>
const { user: loggedInUser } = useUserSession()
</script>

<template>
  <div
    v-if="loggedInUser"
    class="sticky top-20 w-72 lg:w-80 h-fit hidden md:block space-y-6 flex-none"
  >
    <Suspense>
      <template #fallback>
        <div class="w-full bg-card space-y-6 p-6 border rounded-2xl">
          <div class="text-lg font-bold">
            Who To Follow
          </div>
          <div class="space-y-3">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3 w-full">
                <Skeleton class="hidden sm:block size-12 shrink-0 rounded-full" />
                <div class="space-y-1.5 w-full">
                  <Skeleton class="w-full h-4" />
                  <Skeleton class="w-full h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <WhoToFollow />
    </Suspense>
    <Suspense>
      <template #fallback>
        <div class="w-full bg-card space-y-6 p-6 border rounded-2xl">
          <div class="text-lg font-bold">
            Trending Topics
          </div>
          <div class="flex flex-col gap-3">
            <Skeleton
              v-for="i in 3"
              :key="i"
              class="w-full h-10"
            />
          </div>
        </div>
      </template>

      <TrendingTopics />
    </Suspense>
  </div>

  <div
    v-else
    class="sticky top-20 w-72 lg:w-80 h-fit hidden md:block space-y-6 flex-none"
  >
    <Card class="w-full">
      <CardHeader>
        <CardTitle class="text-lg">
          New to Snapity?
        </CardTitle>
        <CardDescription>
          Sign up now to get your own personalized timeline!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <Button
            class="w-full"
            as-child
          >
            <NuxtLink to="/login">
              Login
            </NuxtLink>
          </Button>
          <Button
            variant="secondary"
            class="w-full"
            as-child
          >
            <NuxtLink to="/signup">
              Sign Up
            </NuxtLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style></style>
