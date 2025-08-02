import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true,
    // 生产环境优化配置
    minify: mode === 'production' ? 'terser' : false,
  },
  plugins: [
    mode === 'production' && sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'renda-nh',
      project: 'renda-website',
      // 关键优化：上传后删除 sourcemap
      cleanArtifacts: true,
      // 只上传生产环境 sourcemap
      include: ['./dist'],
      // 忽略测试文件
      ignore: ['**/*.test.*', '**/__mocks__/**']
    })
  ].filter(Boolean) // 过滤掉开发环境的 null 值
}));
