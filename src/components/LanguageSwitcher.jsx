import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageSwitcher() {
  const { lang, updateLang } = useLanguage();

  return (
    <div className="language-switcher">
      <button onClick={() => updateLang('zh-CN')} className={lang.startsWith('zh') ? 'active' : ''}>
        中文
      </button>
      <button onClick={() => updateLang('en')} className={!lang.startsWith('zh') ? 'active' : ''}>
        EN
      </button>
    </div>
  );
}
