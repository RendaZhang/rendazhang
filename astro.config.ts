// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sentry from '@sentry/astro';
import { loadEnv } from 'vite';
import { refreshEnv, getEnv } from './src/utils/index';

const mode = getEnv('NODE_ENV') || 'production';
// Astro 的配置文件是运行在 Node 环境中的，
// 它在读取 .env 文件之前就会执行，
// 所以不能直接像在组件或页面中那样使用 import.meta.env 读取 .env 的变量
// Astro 官方建议在 astro.config.mjs 中
// 通过 Vite 的 loadEnv 或 dotenv 手动加载 .env 文件
// 根据当前模式加载 .env.development 或 .env.production
const env = loadEnv(mode, process.cwd(), '');
process.env = { ...process.env, ...env };
// 刷新快照，确保包含 loadEnv() 写入的变量
refreshEnv();

const PUBLIC_API_BASE_URL = getEnv('API_BASE_URL');
const PUBLIC_CDN_BASE = getEnv('CDN_BASE');
const PUBLIC_NODE_ENV = getEnv('NODE_ENV');
const PUBLIC_SENTRY_DSN = getEnv('SENTRY_DSN');
const PUBLIC_SITE_BASE_URL = getEnv('SITE_BASE_URL');
const PUBLIC_TAG_NAME = getEnv('TAG_NAME');
const SENTRY_AUTH_TOKEN = getEnv('SENTRY_AUTH_TOKEN') ?? undefined;
const SENTRY_ORG = getEnv('SENTRY_ORG') ?? undefined;
const SENTRY_PROJECT = getEnv('SENTRY_PROJECT') ?? undefined;
const SKIP_SENTRY = getEnv('SKIP_SENTRY');

// 可以在本地的 .env.local 配置环境变量为 true 临时跳过 Sentry
const skipSentry = SKIP_SENTRY === 'true';

export default defineConfig({
  integrations: [
    react(),
    ...(skipSentry
      ? []
      : [
          sentry({
            clientInitPath: './src/sentry.client.config.ts',
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
        ])
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
    // 使用 vite.define 显式暴露公共变量，
    // 变量名必须以 PUBLIC_ 前缀开头，
    // 这些变量会在浏览器端通过 import.meta.env.PUBLIC_* 访问
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
