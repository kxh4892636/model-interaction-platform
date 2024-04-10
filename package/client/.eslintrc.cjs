// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    // 'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  // plugins: ['@typescript-eslint', 'jsx-a11y', 'import'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'import/default': 0,
    'import/no-named-as-default-member': 0,
    'no-use-before-define': 0,
    'lines-between-class-members': 0,
    'react-hooks/exhaustive-deps': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['package/*/tsconfig.json'],
      },
    },
  },
}
