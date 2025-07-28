export function getLangContent() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const content = window.aboutPageContent || {};
  return (content[lang] && content[lang].contact) || null;
}

export function getCurrentLang() {
  if (typeof document === 'undefined') {
    return 'zh';
  }
  return document.documentElement.lang || 'zh';
}
