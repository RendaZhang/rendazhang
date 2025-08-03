import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  release: import.meta.env.PUBLIC_TAG_NAME,
  environment: import.meta.env.PUBLIC_NODE_ENV,
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  sendDefaultPii: true,
  debug: import.meta.env.PUBLIC_NODE_ENV == 'development',
  beforeSend(event, hint) {
    // 控制台打印区分生产环境和非生产环境的错误
    if (import.meta.env.PUBLIC_NODE_ENV !== 'production') {
      console.log('Sentry event filtered in non-production env: ', hint.originalException);
    } else {
      console.log('Sentry event filtered in production env: ' + hint.originalException);
    }
    // 过滤浏览器扩展错误
    const isExtensionError = event.exception?.values?.some(
      value => value.stacktrace?.frames?.some(
        frame => frame.filename?.includes('chrome-extension:')
      )
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
