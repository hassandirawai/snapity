import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-tiptap-editor',
    '@peterbud/nuxt-query',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-auth-utils',
    '@nuxthub/core',
  ],
  devtools: { enabled: true, timeline: { enabled: true } },
  app: { head: { title: 'Snapity' } },
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-07-15',

  /*hub: {
    db: {
      dialect: 'postgresql',
      driver: 'neon-http',
    },
    blob: false,
    cache: false,
  },*/

  routeRules: {
    '/': {
      ssr: false,
    },
    '/login': {
      ssr: false,
    },
    '/signup': {
      ssr: false,
    },
    '/search': {
      ssr: false
    },
    '/reastpassword': {
      ssr: false
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  eslint: { config: { standalone: false } },
  shadcn: { prefix: '', componentDir: '@/components/ui' },
  colorMode: { classSuffix: '' },
  nuxtQuery: {
    autoImports: ['useQueryClient', 'useQuery', 'useMutation', 'useInfiniteQuery'],
    devtools: true,
  },
})
