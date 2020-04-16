module.exports = {
  "root": [
    'plugin:vue/essential',
    'eslint:recommended'
  ],

  "env": {
    "node": true
  },

  "extends": [
    "plugin:vue/essential",
    "eslint:recommended"
  ],

  // "rules": {
  //   'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  //   "no-undef": process.env.NODE_ENV === 'production' ? 'off' : 'off',
  // },

  "parserOptions": {
    "parser": "babel-eslint"
  },

  root: true,

  env: {
    node: true
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-undef': 'off',
    'vue/no-unused-vars': 'off',
    'no-case-declarations': 'off',
  },

  parserOptions: {
    parser: 'babel-eslint'
  }
}