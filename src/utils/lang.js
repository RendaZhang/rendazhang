export function getLangContent() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const content = window.aboutPageContent || {};
  return (content[lang] && content[lang].contact) || null;
}

export function getLangFromRequest(astroContext) {
  // 1. 尝试从cookie获取
  const cookieLang = astroContext.cookies.get('preferred_lang')?.value;
  if (cookieLang) return cookieLang;

  // 2. 尝试从HTML标签获取
  const htmlLang = astroContext.request.headers.get('accept-language')?.split(',')[0];
  if (htmlLang && htmlLang.startsWith('zh')) return 'zh-CN';
  if (htmlLang && htmlLang.startsWith('en')) return 'en';

  // 3. 默认值
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
