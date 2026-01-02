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
  ],
  devtools: { enabled: true, timeline: { enabled: true } },
  app: { head: { title: 'Snapity' } },
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-07-15',

  auth: {
    loadStrategy: 'client-only'
  },

  // Route caching rules
  routeRules: {
    // Public pages (can cache)
    '/login': { cache: { maxAge: 60 * 10 } },
    '/signup': { cache: { maxAge: 60 * 10 } },
    '/resetpassword': { cache: { maxAge: 60 * 10 } },

    // Protected pages (no cache, per-user)
    '/': { cache: false },
    '/chat/**': { cache: false },
    '/post/**': { cache: false },
    '/users/**': { cache: false },
    '/search': { cache: false },
    '/hashtag/**': { cache: false },
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
