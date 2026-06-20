import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import astroPlugin from 'eslint-plugin-astro';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const LOCAL_ROOT_IMPORT = String.raw`(?:(?:\.\./)+|src/)`;
const CSS_IMPORT = String.raw`\.css(?:\?|$)`;

const noUiLayerImports = {
  regex: `^${LOCAL_ROOT_IMPORT}(?:components|pages|layouts|styles)(?:/|$)`,
  message:
    'Directory ownership: services and controllers must not import UI, page, layout, or style modules. Move shared contracts into constants, types, or utils.'
};

const noCssImports = {
  regex: CSS_IMPORT,
  message:
    'Directory ownership: non-UI logic must not import CSS. Add styles through src/styles and the page/layout style entrypoints.'
};

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
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname
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
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 10
        }
      ],
      '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true, ignoreVoid: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-undef': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'error',
      'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
  },
  {
    files: ['src/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [noUiLayerImports, noCssImports]
        }
      ]
    }
  },
  {
    files: ['src/controllers/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [noUiLayerImports, noCssImports]
        }
      ]
    }
  },
  {
    files: ['src/stores/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              message:
                'Directory ownership: stores must remain framework-neutral. Read store state from React through src/hooks instead.'
            },
            {
              name: 'react-dom',
              message:
                'Directory ownership: stores must remain framework-neutral. DOM rendering belongs in components.'
            },
            {
              name: '@sentry/react',
              message:
                'Directory ownership: stores must remain framework-neutral. Use a utility boundary instead of React-specific instrumentation.'
            }
          ],
          patterns: [
            {
              regex: `^${LOCAL_ROOT_IMPORT}(?:components|pages|layouts|services|hooks|styles)(?:/|$)`,
              message:
                'Directory ownership: stores may depend on constants/types and pure helpers, not UI, services, hooks, pages, layouts, or styles.'
            },
            noCssImports
          ]
        }
      ]
    }
  },
  {
    files: ['src/utils/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: `^${LOCAL_ROOT_IMPORT}(?:components|pages|layouts|services|controllers|stores|hooks|styles)(?:/|$)`,
              message:
                'Directory ownership: utils must stay UI- and flow-neutral. Move orchestration to services, controllers, hooks, or components.'
            },
            noCssImports
          ]
        }
      ]
    }
  },
  {
    files: ['src/content/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: `^${LOCAL_ROOT_IMPORT}(?:components|pages|layouts|services|controllers|stores|hooks|styles)(?:/|$)`,
              message:
                'Directory ownership: content modules own static copy/data and must not import UI, runtime flow, services, pages, or styles.'
            },
            noCssImports
          ]
        }
      ]
    }
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/hooks/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: `^${LOCAL_ROOT_IMPORT}(?:pages|layouts)(?:/|$)`,
              message:
                'Directory ownership: React UI and hooks must not import Astro pages or layouts. Pass route/layout data through props or shared constants.'
            },
            {
              regex: `^${LOCAL_ROOT_IMPORT}utils/env(?:\\.ts)?$`,
              message:
                'Directory ownership: React UI and hooks must not read env internals directly. Expose a semantic helper from src/utils instead.'
            },
            {
              regex: `^${LOCAL_ROOT_IMPORT}utils(?:/index)?(?:\\.ts)?$`,
              importNames: ['envKeyMap', 'getEnv', 'refreshEnv', 'isProduction', 'getCdnUrl'],
              message:
                'Directory ownership: React UI and hooks must not read env internals directly. Expose a semantic helper from src/utils instead.'
            }
          ]
        }
      ]
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
