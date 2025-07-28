export function getCurrentLang() {
  if (typeof document === 'undefined') {
    return 'zh';
  }

  // 优先使用 HTML 标签上的语言设置
  const htmlLang = document.documentElement.lang;
  if (htmlLang) {
    return htmlLang.startsWith('zh') ? 'zh' : 'en';
  }

  // 后备方案：检查本地存储
  try {
    const storedLang = localStorage.getItem('preferred_lang');
    if (storedLang) {
      return storedLang.startsWith('zh') ? 'zh' : 'en';
    }
  } catch (e) {
    console.error('读取语言存储失败', e);
  }

  // 默认值
  return 'zh';
}
