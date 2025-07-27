import * as espree from 'espree';
export default [
  {
    files: ['**/*.{js,jsx,astro}'],
    languageOptions: {
      parser: espree,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } }
    },
    rules: {}
  }
];
