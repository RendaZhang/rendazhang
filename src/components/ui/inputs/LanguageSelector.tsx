import type { ReactElement } from 'react';
import { useLanguage } from '../../providers';

export default function LanguageSelector(): ReactElement {
  const { lang, updateLang } = useLanguage();
  const targetLang = lang === 'en' ? 'zh-CN' : 'en';
  const showEnglish = targetLang === 'en';

  return (
    <button
      type="button"
      className="c-nav-control c-language-selector-main"
      lang={targetLang}
      aria-label={showEnglish ? 'Switch to English' : '切换到中文'}
      onClick={() => updateLang(targetLang)}
    >
      {showEnglish ? 'EN' : '中文'}
    </button>
  );
}
