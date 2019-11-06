module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'standard',
    'eslint:recommended',
    "plugin:@typescript-eslint/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    esModuleInterop: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'jest'
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'after-used',
      'ignoreRestSiblings': false
    }],
    '@typescript-eslint/no-use-before-define': ['error', {
      functions: false
    }]
  },
  overrides: [{
    files: [
      'src/**/*.test.ts'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 0
    }
  }]
}
