import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { LANG_STORAGE_KEY } from '../../config.js';

const I18nContext = createContext();

export function I18nProvider({ children, initialLang }) {
  const initialSet = useRef(false);

  // Use the server-rendered language as the initial state to avoid
  // hydration mismatches. The actual preferred language will be
  // resolved on the client in the effect below.
  const [lang, setLang] = useState(initialLang || 'zh-CN');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!initialSet.current) {
      initialSet.current = true;

      const domLang =
        document.documentElement.dataset.initialLang ||
        document.documentElement.lang ||
        initialLang ||
        'zh-CN';
      let storedLang = null;
      try {
        storedLang = localStorage.getItem(LANG_STORAGE_KEY);
      } catch {}
      // 首次挂载时优先使用本地存储的语言设置
      const effectiveLang = storedLang || domLang;
      setLang(effectiveLang);
      document.documentElement.lang = effectiveLang;
      try {
        localStorage.setItem(LANG_STORAGE_KEY, effectiveLang);
      } catch {}
      window.dispatchEvent(new CustomEvent('langChanged', { detail: effectiveLang }));
      return;
    }

    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
    window.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
  }, [lang, initialLang]);

  const updateLang = (newLang) => {
    setLang(newLang);
  };

  return <I18nContext.Provider value={{ lang, updateLang }}>{children}</I18nContext.Provider>;
}

export function useLanguage() {
  const context = useContext(I18nContext);

  const getDomLang = () => {
    if (typeof document === 'undefined') return 'zh-CN';
    return document.documentElement.dataset.initialLang || document.documentElement.lang || 'zh-CN';
  };

  const [lang, setLang] = useState(() => context?.lang || getDomLang());

  useEffect(() => {
    if (context) {
      setLang(context.lang);
      return;
    }
    const handler = (e) => setLang(e.detail);
    window.addEventListener('langChanged', handler);
    return () => window.removeEventListener('langChanged', handler);
  }, [context]);

  const updateLang =
    context?.updateLang ||
    ((newLang) => {
      setLang(newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
        try {
          localStorage.setItem(LANG_STORAGE_KEY, newLang);
        } catch {}
        window.dispatchEvent(new CustomEvent('langChanged', { detail: newLang }));
      }
    });

  return { lang, updateLang };
}
