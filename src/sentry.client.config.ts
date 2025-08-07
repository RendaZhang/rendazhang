import * as Sentry from '@sentry/astro';
import { getEnv, isProduction } from './utils/env';
import logger from './utils/logger';

// sentry.client.config.ts runs in Vite’s build process,
// where import.meta.env is already populated
Sentry.init({
  dsn: getEnv('SENTRY_DSN') ?? undefined,
  release: getEnv('TAG_NAME') ?? undefined,
  environment: getEnv('NODE_ENV') ?? undefined,
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  sendDefaultPii: true,
  // set this to false if you don't want sentry logging
  debug: !isProduction(),
  beforeSend(event, hint) {
    // 控制台打印区分生产环境和非生产环境的错误
    if (!isProduction()) {
      logger.log('Sentry event filtered in non-production env: ', hint.originalException);
    } else {
      logger.log('Sentry event filtered in production env: ' + hint.originalException);
    }
    // 过滤浏览器扩展错误
    const isExtensionError = event.exception?.values?.some((value) =>
      value.stacktrace?.frames?.some((frame) => frame.filename?.includes('chrome-extension:'))
    );
    if (isExtensionError) {
      return null;
    }
    // 过滤敏感路径
    const { request } = event;
    const sensitivePaths = ['password', 'token', 'auth'];
    if (sensitivePaths.some((path) => request?.url?.includes(path))) {
      return null;
    }
    return event;
  }
});
