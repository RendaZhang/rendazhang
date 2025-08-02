export default {
    debug: true,
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
     */
    beforeSend(event) {
        const { request } = event;
        console.log('Server beforeSend: Sentry event trigger:' + request.dsn);
        // 过滤敏感路径
        const sensitivePaths = ['password', 'token', 'auth'];
        if (sensitivePaths.some((path) => request?.url?.includes(path))) {
            return null;
        }
        // 开发环境仅记录，不阻止上报，方便调试
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Sentry event captured in development');
        }
        return event;
    }
}
