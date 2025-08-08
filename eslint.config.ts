import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import astroPlugin from 'eslint-plugin-astro';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    // 只忽略构建目录和依赖
    ignores: ['dist', 'node_modules', 'docs']
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      astro: astroPlugin,
      prettier: prettierPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      'no-undef': 'off',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
  },
  // 新增针对声明文件的特殊配置
  {
    files: ['**/*.d.ts'],
    rules: {
      // 禁用对三斜线引用的检查
      '@typescript-eslint/triple-slash-reference': 'off',
      // 允许空接口（用于环境变量类型扩展）
      '@typescript-eslint/no-empty-object-type': 'off',
      // 禁用其他不必要的规则
      'no-var': 'off',
      'prettier/prettier': 'off'
    }
  },
  // Astro 配置保持不变
  ...astroPlugin.configs.recommended
];
