module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules', '.shots', 'coverage'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react-refresh'],
  settings: { react: { version: 'detect' } },
  rules: {
    // Context modules intentionally co-locate the provider component with its
    // hook (useLanguage). That is the standard pattern and only affects hot
    // reload granularity, not correctness, so the rule is off here.
    'react-refresh/only-export-components': 'off',
    // The i18n layer deliberately uses `{ ar, en }` records and typed index
    // access, so `any` is banned but unchecked indexing is expected.
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      // Build/verification scripts are Node CLIs that report to stdout.
      files: ['scripts/**/*.{mjs,tsx,ts}'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}