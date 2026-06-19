// server/plugins/error-logger.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error) => {
    console.error('FULL SSR ERROR:', error.stack)
  })
})
