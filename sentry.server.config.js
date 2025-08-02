export default {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // Logs
    enableLogs: true,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    sourceMapsUploadOptions: {
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
    },
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    // 关键优化：上传后删除 sourcemap
    cleanArtifacts: true,
    // 只上传生产环境 sourcemap
    include: ['./dist'],
    // 忽略测试文件
    ignore: ['**/*.test.*', '**/__mocks__/**'],
    // 更安全的 beforeSend
    /**
     * @param {{ request: any; }} event
     * @param {{ originalException: any; }} hint
     */
    beforeSend(event, hint) {
    const { request } = event;
    // 过滤敏感路径
    const sensitivePaths = ['password', 'token', 'auth'];
    if (sensitivePaths.some((path) => request?.url?.includes(path))) {
        return null;
    }
    // 过滤开发环境错误
    if (process.env.NODE_ENV !== 'production') {
        console.warn('Sentry event filtered in development:', hint.originalException);
        return null;
    }
    return event;
    }
}
