import { LANG_STORAGE_KEY } from '../constants/index.js';
import storage from './storage';
import * as Sentry from '@sentry/react';

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
    console.log("langUtils getCurrentLang storedLang: " + storedLang);
    if (storedLang) return storedLang;
  } catch (e) {
    console.error('读取语言存储失败', e);
    Sentry.captureException(e);
  }

  // 默认值
  return 'zh-CN';
}
