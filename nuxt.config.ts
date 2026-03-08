export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-tiptap-editor',
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
      driver: 'neon-http',
    },
    blob: {
      driver: 'fs', // ← explicit filesystem, works with useMultipartUpload
      dir: '.data/blob',
    },
  },

  $production: {
    hub: {
      blob: {
        driver: 'vercel-blob',
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      },
    },
    image: {
      provider: 'vercel',
    },
  },

  image: {
    provider: 'vercel',
    screens: {},
  },

  $production: {
    image: {
      provider: 'vercel',
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
    '/reastpassword': {
      ssr: false,
    },
  },

  eslint: { config: { standalone: false } },
  shadcn: { prefix: '', componentDir: '@/components/ui' },
  colorMode: { classSuffix: '' },
})
