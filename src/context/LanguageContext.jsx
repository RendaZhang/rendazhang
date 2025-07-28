import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { LANG_STORAGE_KEY } from '../config.js';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLang }) {
  const initialSet = useRef(false);

  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        document.documentElement.dataset.initialLang ||
        document.documentElement.lang ||
        initialLang ||
        'zh-CN'
      );
    }
    return initialLang || 'zh-CN';
  });

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

  return (
    <LanguageContext.Provider value={{ lang, updateLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // 默认返回中文
    return { lang: 'zh', updateLang: () => {} };
  }
  return context;
}
