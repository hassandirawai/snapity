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
  ],
  devtools: {
    enabled: true,
    timeline: { enabled: true },
  },
  app: {
    head: { title: 'Snapity' },
  },
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-12-26',

  // ✅ PRODUCTION PROVEN - Node.js + Full transpilation
  nitro: {
    preset: 'vercel',
    esbuild: {
      options: {
        target: 'node18'
      }
    }
  },

  vite: {
    plugins: [tailwindcss()],
    define: {
      global: 'globalThis',
    },
  },

  eslint: {
    config: { standalone: false },
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  colorMode: {
    classSuffix: '',
  },
  nuxtQuery: {
    autoImports: ['useQueryClient', 'useQuery', 'useMutation', 'useInfiniteQuery'],
    devtools: true,
  },
})
