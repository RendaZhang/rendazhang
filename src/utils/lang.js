export function getCurrentLang() {
  if (typeof document === 'undefined') {
    return 'zh';
  }
  return document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
}
