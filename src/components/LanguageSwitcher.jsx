import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageSwitcher() {
  const languageContext = useLanguage();

  // 默认使用中文
  const lang = languageContext?.lang || 'zh-CN';
  const updateLang = languageContext?.updateLang || (() => {});

  return (
    <div className="language-switcher">
      <button onClick={() => updateLang('zh-CN')} className={lang === 'zh-CN' ? 'active' : ''}>
        中文
      </button>
      <button onClick={() => updateLang('en')} className={lang === 'en' ? 'active' : ''}>
        EN
      </button>
    </div>
  );
}
