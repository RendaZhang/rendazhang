/**
 * 环境变量工具的设计思路与性能细节 →
 * docs/guides/ENV_UTILS.md
 * Github Link: https://github.com/RendaZhang/rendazhang/blob/master/docs/guides/ENV_UTILS.md
 */

// 注意：若运行时需动态更新环境变量（如 process.env.XXX = 'new'），需改用 rawEnv 函数。
// 但通常环境变量在启动后不变。
// rawEnv 函数（每次调用动态获取环境变量）：
// const rawEnv = () => {
//   if (typeof import.meta !== 'undefined' && import.meta.env) {
//     return import.meta.env;
//   }
//   if (typeof process !== 'undefined' && process.env) {
//     return process.env;
//   }
//   return {};
// };

// 只初始化一次的常量（模块加载时缓存环境变量）
// 懒加载
let _envCache;
const buildSnapshot = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) return { ...import.meta.env };
  if (typeof process !== 'undefined' && process.env) return { ...process.env };
  return {};
};

// 类似 SENTRY_AUTH_TOKEN 的敏感变量已经被 Vite 限制只能在服务端访问，
// Vite 只允许前端访问带 PUBLIC_ 前缀的环境变量。
const envKeyMap = {
  TAG_NAME: ['PUBLIC_TAG_NAME'],
  NODE_ENV: ['PUBLIC_NODE_ENV', 'NODE_ENV'],
  CDN_BASE: ['PUBLIC_CDN_BASE'],
  API_BASE_URL: ['PUBLIC_API_BASE_URL'],
  SENTRY_DSN: ['PUBLIC_SENTRY_DSN', 'SENTRY_DSN'],
  SITE_BASE_URL: ['PUBLIC_SITE_BASE_URL'],
  SENTRY_AUTH_TOKEN: ['SENTRY_AUTH_TOKEN'],
  SENTRY_ORG: ['SENTRY_ORG'],
  SENTRY_PROJECT: ['SENTRY_PROJECT'],
  SKIP_SENTRY: ['SKIP_SENTRY']
};

// 从 _envCache 中获取环境变量
export const getEnv = (key) => {
  // 首次使用时才加载
  if (!_envCache) _envCache = buildSnapshot();

  let aliases = envKeyMap[key];
  if (!aliases) {
    if (key.startsWith('PUBLIC_')) {
      aliases = [key, key.replace(/^PUBLIC_/, '')];
    } else {
      aliases = [`PUBLIC_${key}`, key];
    }
  }

  for (const k of aliases) if (k in _envCache) return _envCache[k];
  return null;
};

// 刷新 _envCache 的环境变量
export const refreshEnv = () => { _envCache = buildSnapshot(); };

export const isProduction = () => getEnv('NODE_ENV') === 'production';

export const getCdnUrl = (path) => {
  const cdnBase = getEnv('CDN_BASE') || '/';
  return `${cdnBase}/${path.replace(/^\//, '')}`;
};
