import { LANG_STORAGE_KEY } from '../constants';
import storage from './storage';
import logger from './logger';
import * as Sentry from '@sentry/react';

export function getCurrentLang(): string {
  if (typeof document === 'undefined') {
    return 'zh-CN';
  }

  // 优先使用当前文档的语言设置
  const docLang = document.documentElement.lang;
  if (docLang) return docLang;

  // 后备方案：检查存储
  try {
    const storedLang = storage.get<string>(LANG_STORAGE_KEY);
    logger.log('langUtils getCurrentLang storedLang: ' + storedLang);
    if (typeof storedLang === 'string') return storedLang;
  } catch (e) {
    logger.error('读取语言存储失败', e);
    Sentry.captureException(e);
  }

  // 默认值
  return 'zh-CN';
}
