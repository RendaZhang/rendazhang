import { useEffect, useState } from 'react';
import { LANG_STORAGE_KEY } from '../config.js';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('zh-CN');

  useEffect(() => {
    let stored;
    try {
      stored = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {}
    const initial = stored || 'zh-CN';
    setLang(initial);
    document.documentElement.lang = initial;
  }, []);

  const handleChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
    document.documentElement.lang = newLang;
    window.dispatchEvent(new CustomEvent('langChanged', { detail: newLang }));
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
