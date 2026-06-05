export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxthub/core',
  ],
  compatibilityDate: '2025-07-15',
  app: { head: { title: 'Snapity' } },
  css: ['~/assets/css/tailwind.css'],

  devtools: {
    enabled: true,
  },

  hub: {
    db: {
      dialect: 'postgresql',
      driver: 'neon-http', // or 'neon-http'
      applyMigrationsDuringBuild: false,
    },
    blob: true,
  },

  image: {
    provider: 'none',
  },

  $production: {
    image: {
      provider: 'none',
    },
  },

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
      ssr: false,
    },
    '/resetpassord': {
      ssr: false,
    },
  },

  eslint: { config: { standalone: false } },
  shadcn: { prefix: '', componentDir: '@/components/ui' },
  colorMode: { classSuffix: '' },

  vite: {
    optimizeDeps: {
      include: [
        '@lucide/vue',
        '@tanstack/vue-query',
        '@tiptap/core',
        '@tiptap/extension-mention',
        '@tiptap/extension-placeholder',
        '@tiptap/starter-kit',
        '@tiptap/vue-3',
        '@vee-validate/zod',
        'browser-image-compression',
        'class-variance-authority',
        'clsx',
        'date-fns',
        'lucide-vue-next',
        'reka-ui',
        'tailwind-merge',
        'vue-advanced-cropper',
        'vue-sonner',
        'zod',
      ],
    },
  },
})
