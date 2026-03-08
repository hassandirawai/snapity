import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    vue: true,
    typescript: true,
    formatters: false,
    stylistic: {
      quotes: 'single',
    },
    rules: {
      'vue/max-attributes-per-line': ['warn', {
        singleline: { max: 3 },
        multiline: { max: 1 },
      }],
      'vue/first-attribute-linebreak': ['warn', {
        singleline: 'beside',
        multiline: 'below',
      }],
      'vue/html-closing-bracket-newline': ['warn', {
        singleline: 'never',
        multiline: 'always',
      }],
      'vue/html-indent': ['warn', 2],
      'vue/html-self-closing': ['warn', {
        html: { void: 'never', normal: 'always', component: 'always' },
        svg: 'always',
        math: 'always',
      }],
    },
  }),
)
