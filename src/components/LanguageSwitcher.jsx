import { useEffect, useState } from 'react';
import { LANG_STORAGE_KEY } from '../config.js';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Detect initial language
    let stored;
    try {
      stored = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {}
    const browserLang = (navigator.language || '').toLowerCase();
    const initial = stored || (browserLang.startsWith('zh') ? 'zh-CN' : 'en');
    setLang(initial);
    document.documentElement.lang = initial;
  }, []);

  const handleChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
    document.documentElement.lang = newLang;
    // Force reload to update multi-language content
    window.location.reload();
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => handleChange('zh-CN')}
        className={lang.startsWith('zh') ? 'active' : ''}
      >
        中文
      </button>
      <button onClick={() => handleChange('en')} className={!lang.startsWith('zh') ? 'active' : ''}>
        EN
      </button>
    </div>
  );
}
