// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_BASE_URL } from './src/config.js';
import { API_BASE_URL } from './src/constants/api.js';
import sentry from '@sentry/astro';
import react from '@astrojs/react';

const NODE_ENV = process.env.NODE_ENV || import.meta.env.NODE_ENV || '';
const TAG_NAME = process.env.TAG_NAME || import.meta.env.TAG_NAME || '';
const SENTRY_DSN = process.env.SENTRY_DSN || import.meta.env.SENTRY_DSN || '';
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || import.meta.env.SENTRY_AUTH_TOKEN || '';
const SENTRY_ORG = process.env.SENTRY_ORG || import.meta.env.SENTRY_ORG || '';
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || import.meta.env.SENTRY_PROJECT || '';

export default defineConfig({
  integrations: [
    react(),
    sentry({
      release: TAG_NAME,
      dsn: SENTRY_DSN,
      sourceMapsUploadOptions: {
        authToken: SENTRY_AUTH_TOKEN,
        org: SENTRY_ORG,
        project: SENTRY_PROJECT
      },
      // 自动清理旧文件
      cleanArtifacts: true,
      // 启用 SDK 日志
      enableLogs: true,
      // 包含 PII (个人身份信息) 数据
      sendDefaultPii: true,
      // 包含的目录
      include: ['./dist'],
      // 包含所有文件类型
      ext: ['js', 'ts', 'jsx', 'tsx', 'astro'],
      // 忽略测试文件
      ignore: ['**/*.test.*', '**/__mocks__/**'],
      // 客户端配置覆盖项
      debug: false,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      // 显式指定客户端配置文件路径
      configFile: './src/sentry.client.config.js'
    })
  ],
  vite: {
    server: {
      proxy: {
        [API_BASE_URL]: {
          target: SITE_BASE_URL,
          changeOrigin: true,
          secure: true,
          // 更安全的 rewrite
          rewrite: (path) =>
            path.replace(
              new RegExp(`^${API_BASE_URL}`),
              API_BASE_URL.startsWith('/') ? API_BASE_URL : `/${API_BASE_URL}`
            )
        }
      }
    },
    define: {
      // 使 环境变量 在客户端可用
      'import.meta.env.PUBLIC_TAG_NAME': JSON.stringify(import.meta.env.TAG_NAME),
      'import.meta.env.PUBLIC_NODE_ENV': JSON.stringify(import.meta.env.NODE_ENV),
      'import.meta.env.PUBLIC_CDN_BASE': JSON.stringify(
        `https://cdn.jsdelivr.net/gh/rendazhang/rendazhang@${import.meta.env.TAG_NAME}`
      )
    },
    // 添加构建优化
    build: {
      // 必须启用 sourcemap
      sourcemap: true
    }
  }
  // 安全头 Content-Security-Policy (CSP) 设置 已经在 Nginx 中配置好了
  // 不需要在前端额外配置 CSP 了
});
