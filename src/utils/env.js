const rawEnv = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }
  return {};
};

const envKeyMap = {
  TAG_NAME: ['PUBLIC_TAG_NAME'],
  NODE_ENV: ['PUBLIC_NODE_ENV', 'NODE_ENV'],
  CDN_BASE: ['PUBLIC_CDN_BASE'],
  API_BASE_URL: ['PUBLIC_API_BASE_URL'],
  SENTRY_DSN: ['PUBLIC_SENTRY_DSN'],
  SITE_BASE_URL: ['PUBLIC_SITE_BASE_URL'],
  SENTRY_AUTH_TOKEN: ['SENTRY_AUTH_TOKEN'],
  SENTRY_ORG: ['SENTRY_ORG'],
  SENTRY_PROJECT: ['SENTRY_PROJECT'],
  SKIP_SENTRY: ['SKIP_SENTRY']
};

export const getEnv = (key) => {
  const env = rawEnv();
  const keys = envKeyMap[key] || [key];
  for (const k of keys) {
    if (k in env) return env[k];
  }
  return null;
};

export const isProduction = () => getEnv('NODE_ENV') === 'production';

export const getCdnUrl = (path) => {
  const cdnBase = getEnv('CDN_BASE') || '/';
  return `${cdnBase}/${path.replace(/^\//, '')}`;
};
