import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLang }) {
  const [lang, setLang] = useState(initialLang || 'zh-CN');

  useEffect(() => {
    const storedLang = localStorage.getItem('preferred_lang');
    if (storedLang) {
      setLang(storedLang);
      document.documentElement.lang = storedLang;
    }
  }, []);

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
  return useContext(LanguageContext);
}
