import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
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

  hub: {
    db: {
      dialect: 'postgresql',
      driver: 'neon-http',
    },
    blob: false,
    cache: false,
  },

  // Disable SSR only for auth routes
  routeRules: {
    '/login/**': { ssr: false },
    '/signup/**': { ssr: false },
    '/resetpassword/**': { ssr: false },
    // Cache public/feed pages
    '/': { cache: { maxAge: 60 * 5 } }, // 5 mins
  },

  nitro: {
    preset: 'vercel',
    esbuild: {
      options: { target: 'node18' },
    },
    rollupConfig: {
      output: {
        format: 'esm',
      },
    },
  },

  vite: {
    ssr: {
      noExternal: ['vue'],
    },
    plugins: [tailwindcss()],
    define: { global: 'globalThis' },
  },

  eslint: { config: { standalone: false } },
  shadcn: { prefix: '', componentDir: '@/components/ui' },
  colorMode: { classSuffix: '' },
  nuxtQuery: {
    autoImports: ['useQueryClient', 'useQuery', 'useMutation', 'useInfiniteQuery'],
    devtools: true,
  },
})
