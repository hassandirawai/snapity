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
      applyMigrationsDuringBuild: false,
    },
    blob: {
      driver: 's3',
      accessKeyId: import.meta.env.S3_ACCESS_KEY_ID, // defaults to S3_ACCESS_KEY_ID
      secretAccessKey: import.meta.env.S3_SECRET_ACCESS_KEY, // defaults to S3_SECRET_ACCESS_KEY
      bucket: import.meta.env.S3_BUCKET, // defaults to S3_BUCKET
      region: import.meta.env.S3_REGION, // defaults to S3_REGION or 'auto'
      endpoint: import.meta.env.S3_ENDPOINT, // optional, defaults to S3_ENDPOINT
    },
  },

  image: {
    provider: 'none',
  },

  $production: {
    image: {
      provider: 'cloudflare',
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
})
