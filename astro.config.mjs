// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sentry from '@sentry/astro';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV ?? 'production';
// 根据当前模式加载 .env.development 或 .env.production
const env = loadEnv(mode, process.cwd(), '');

const {
  PUBLIC_API_BASE_URL,
  PUBLIC_CDN_BASE,
  PUBLIC_NODE_ENV,
  PUBLIC_SENTRY_DSN,
  PUBLIC_SITE_BASE_URL,
  PUBLIC_TAG_NAME,
  SENTRY_AUTH_TOKEN,
  SENTRY_ORG,
  SENTRY_PROJECT
} = env;

export default defineConfig({
  integrations: [
    react(),
    sentry({
      clientInitPath: './src/sentry.client.config.js',
      // 如有服务端：
      // serverInitPath: './src/sentry.server.config.js',
      sourceMapsUploadOptions: {
        authToken: SENTRY_AUTH_TOKEN,
        org: SENTRY_ORG,
        project: SENTRY_PROJECT,
        telemetry: false // 禁用遥测
      }
      // 自动清理旧文件
      // cleanArtifacts: true,
      // 启用 SDK 日志
      // enableLogs: true,
      // 包含的目录
      // include: ['./dist'],
      // 包含所有文件类型
      // ext: ['js', 'ts', 'jsx', 'tsx', 'astro'],
      // 忽略测试文件
      // ignore: ['**/*.test.*', '**/__mocks__/**'],
      // 显式指定客户端配置文件路径
      // configFile: './src/sentry.client.config.js'
    })
  ],
  vite: {
    server: {
      proxy: {
        [PUBLIC_API_BASE_URL]: {
          target: PUBLIC_SITE_BASE_URL,
          changeOrigin: true,
          secure: true,
          // 更安全的 rewrite
          rewrite: (path) =>
            path.replace(
              new RegExp(`^${PUBLIC_API_BASE_URL}`),
              PUBLIC_API_BASE_URL.startsWith('/') ? PUBLIC_API_BASE_URL : `/${PUBLIC_API_BASE_URL}`
            )
        }
      }
    },
    define: {
      'import.meta.env.PUBLIC_API_BASE_URL': JSON.stringify(PUBLIC_API_BASE_URL),
      'import.meta.env.PUBLIC_CDN_BASE': JSON.stringify(PUBLIC_CDN_BASE),
      'import.meta.env.PUBLIC_NODE_ENV': JSON.stringify(PUBLIC_NODE_ENV),
      'import.meta.env.PUBLIC_SENTRY_DSN': JSON.stringify(PUBLIC_SENTRY_DSN),
      'import.meta.env.PUBLIC_SITE_BASE_URL': JSON.stringify(PUBLIC_SITE_BASE_URL),
      'import.meta.env.PUBLIC_TAG_NAME': JSON.stringify(PUBLIC_TAG_NAME)
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
