export function getLangContent() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const content = window.aboutPageContent || {};
  return (content[lang] && content[lang].contact) || null;
}

export function getLangFromRequest(astroContext = {}) {
  // 仅当在服务器环境且 request 可用时读取 Accept-Language 头部
  const header = astroContext.request?.headers?.get?.('accept-language');
  const htmlLang = header?.split(',')[0];
  if (htmlLang && htmlLang.toLowerCase().startsWith('zh')) return 'zh-CN';
  if (htmlLang && htmlLang.toLowerCase().startsWith('en')) return 'en';

  // 默认值
  return 'zh-CN';
}

export function getCurrentLang() {
  if (typeof document === 'undefined') {
    return 'zh';
  }
  // 优先使用当前文档的语言设置
  const docLang = document.documentElement.lang;
  if (docLang) return docLang;

  // 后备方案：检查本地存储
  try {
    const storedLang = localStorage.getItem('preferred_lang');
    if (storedLang) return storedLang;
  } catch (e) {
    console.error('读取语言存储失败', e);
  }

  // 默认值
  return 'zh-CN';
}
