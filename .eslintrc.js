module.exports = {
  env: {
    es6: true,
    node: true,
    "jest/globals": true
  },
  extends: [
    'standard',
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
