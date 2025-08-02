const NODE_ENV = import.meta.env.NODE_ENV;
export default {
  // 客户端专用配置 (最高优先级)
  // 启用详细日志便于调试
  debug: true,
  // 过滤错误
  beforeSend(event, hint) {
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
    // 过滤开发环境错误
    if (NODE_ENV !== 'production') {
      console.warn('Sentry event filtered in development:', hint.originalException);
      return null;
    }
    return event;
  }
};
