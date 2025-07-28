import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLang }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    // 确保客户端与服务器端语言一致
    if (typeof window !== 'undefined' && initialLang !== lang) {
      setLang(initialLang);
      document.documentElement.lang = initialLang;
    }
  }, [initialLang]);

  const updateLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('preferred_lang', newLang);
    document.documentElement.lang = newLang;
    window.dispatchEvent(new CustomEvent('langChanged', { detail: newLang }));
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
