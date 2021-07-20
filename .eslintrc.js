module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    "plugin:vue/recommended"
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quotes': 'off',
    'vue/v-bind-style': 'off',
    'semi': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/order-in-components': 'off',
    'vue/attributes-order': 'off',
    'vue/html-self-closing': 'off',
    'semi-spacing': 'off',
    'space-before-function-paren': 'off',
    'spaced-comment': 'off',
    "eslint-disable-next-line": 'off',
    'prefer-const': 'off'
  }
}
