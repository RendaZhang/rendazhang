/**
 * 环境变量工具的设计思路与性能细节 →
 * docs/guides/ENV_UTILS.md
 * Github Link: https://github.com/RendaZhang/rendazhang/blob/master/docs/guides/ENV_UTILS.md
 *
 * 在启动阶段统一读取并校验 env，业务层只用纯 JS 常量，既安全又高效。
 * 若必须在运行时动态追加 env，请调用 refreshEnv() 手动刷新快照。
 */

///////////////////////////
// 1. 快照构建 & 缓存逻辑 //
///////////////////////////

let _envCache: Record<string, string> | undefined;

/** 捕获一份只读快照，避免在热路径频繁访问 process.env */
const buildSnapshot = (): Record<string, string> => {
  // Browser (Bundled by Vite / Rollup)
  if (typeof import.meta !== 'undefined' && 'env' in import.meta) {
    // 需要断言为特定结构，因为 TS 对 import.meta.env 无统一标准
    return { ...(import.meta as { env: Record<string, string> }).env };
  }

  // Node / Bun / EdgeRuntime
  if (typeof process !== 'undefined' && process.env) {
    return { ...process.env } as Record<string, string>;
  }

  return {};
};

////////////////////////
// 2. 键名别名映射表  //
////////////////////////

export const envKeyMap = {
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
} as const;

export type KnownEnvKey = keyof typeof envKeyMap;

/////////////////////
// 3. 公共 API     //
/////////////////////

/**
 * 获取指定环境变量
 * @param key      变量名（支持 KnownEnvKey 或任意 string）
 * @param fallback 如果变量不存在则返回该兜底值（默认 null）
 */
export function getEnv<K extends string = KnownEnvKey>(
  key: K,
  fallback: string | null = null
): string | null {
  if (!_envCache) _envCache = buildSnapshot();

  // 1) 优先查映射表；2) 根据 PUBLIC_ 前缀推导互补键；3) 直接取原键
  const aliases =
    (envKeyMap as Record<string, readonly string[]>)[key] ??
    (key.startsWith('PUBLIC_') ? [key, key.replace(/^PUBLIC_/, '')] : [`PUBLIC_${key}`, key]);

  for (const k of aliases) {
    if (k in _envCache) return _envCache[k];
  }

  return fallback;
}

/** 手动刷新缓存 —— 在动态修改 process.env 后调用 */
export function refreshEnv(): void {
  _envCache = buildSnapshot();
}

/** 是否生产环境 */
export const isProduction = (): boolean => getEnv('NODE_ENV') === 'production';

/** 生成带 CDN Base 的完整 URL */
export const getCdnUrl = (path: string): string => {
  const cdnBase = getEnv('CDN_BASE', '/');
  return `${cdnBase!.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};
