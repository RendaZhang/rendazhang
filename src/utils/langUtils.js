import { LANG_STORAGE_KEY } from '../config.js';
import storage from './storage.js';

export function getCurrentLang() {
  if (typeof document === 'undefined') {
    return 'zh-CN';
  }
  // 优先使用当前文档的语言设置
  const docLang = document.documentElement.lang;
  if (docLang) return docLang;

  // 后备方案：检查存储
  try {
    const storedLang = storage.get(LANG_STORAGE_KEY);
    if (storedLang) return storedLang;
  } catch (e) {
    console.error('读取语言存储失败', e);
  }

  // 默认值
  return 'zh-CN';
}
