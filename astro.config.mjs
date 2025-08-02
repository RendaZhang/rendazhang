// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_BASE_URL } from './src/config.js';
import { API_BASE_URL } from './src/constants/api.js';
import sentry from '@sentry/astro';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react(), sentry()],
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
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.sentry-cdn.com; connect-src 'self' https://*.sentry.io"
    }
  }
});
