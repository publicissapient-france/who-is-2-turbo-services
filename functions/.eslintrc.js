module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/coverage/**/*',
    '.eslintrc.js',
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    'max-len': ['error', { code: 100, ignoreUrls: true }],
  },
};
