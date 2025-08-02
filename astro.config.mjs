// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_BASE_URL } from './src/config.js';
import { API_BASE_URL } from './src/constants/api.js';
import sentry from '@sentry/astro';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react(),
    sentry({
      dsn: process.env.SENTRY_DSN,
      // 按环境调整采样率
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
      // 生产环境启用 replay
      replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
      // 增强安全配置
      sendDefaultPii: false, // 禁用 PII 收集
      autoSessionTracking: false,
      // 更安全的 beforeSend
      /**
       * @param {{ request: any; }} event
       * @param {{ originalException: any; }} hint
       */
      beforeSend(event, hint) {
        const { request } = event;
        // 过滤敏感路径
        const sensitivePaths = ['password', 'token', 'auth'];
        if (sensitivePaths.some((path) => request?.url?.includes(path))) {
          return null;
        }
        // 过滤开发环境错误
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Sentry event filtered in development:', hint.originalException);
          return null;
        }
        return event;
      }
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
    // 添加构建优化
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            sentry: ['@sentry/react', '@sentry/tracing'],
            react: ['react', 'react-dom']
          }
        }
      }
    }
  },
  // 添加安全头
  security: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.sentry-cdn.com;"
    }
  }
});
