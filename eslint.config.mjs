import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu(({
  formatters: true,
  vue: true,
  stylistic: {
    quotes: 'single',
    semi: false,
  },
  typescript: true,
})))

/* export default antfu({
  formatters: true,
  vue: true,
  stylistic: {
    quotes: 'single',
  },
  typescript: true,
}) */
