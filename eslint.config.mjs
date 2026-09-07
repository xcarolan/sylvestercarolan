// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(prettierRecommended, {
  rules: {
    'no-console': 'off',
    'vue/no-v-html': 'off',
    'vue/html-self-closing': 'off',
  },
})
