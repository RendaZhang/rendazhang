import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true,
    // 生产环境优化配置
    minify: mode === 'production' ? 'terser' : false,
  },
  plugins: [mode === 'production' && sentryVitePlugin()].filter(Boolean)
}));
