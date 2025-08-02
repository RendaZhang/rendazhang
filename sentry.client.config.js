export default {
  debug: true,
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  // Logs
  enableLogs: true,
  // Send user info etc.
  sendDefaultPii: true,
  /**
   * Filter sensitive URLs and log development events
   * @param {{ request: any }} event
   */
  beforeSend(event) {
    const { request } = event;
    console.log('Client beforeSend: Sentry event trigger:' + request.dsn);
    const sensitivePaths = ['password', 'token', 'auth'];
    if (sensitivePaths.some((path) => request?.url?.includes(path))) {
      return null;
    }
    if (import.meta.env.DEV) {
      console.warn('Sentry event captured in development');
    }
    return event;
  }
};
