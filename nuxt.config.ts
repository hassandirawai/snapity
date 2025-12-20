import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
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
    timeline: {
      enabled: true,
    },
  },
  nitro: {
    preset: 'vercel',
  },
  app: {
    head: {
      title: 'Snapity',
    },
  },
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['vue'],
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
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
