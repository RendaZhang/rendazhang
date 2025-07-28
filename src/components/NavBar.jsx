import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from '../config.js';
import { NAV_CONTENT } from '../content/navContent.js';
import { getCurrentLang } from '../utils/lang.js';

export default function NavBar() {
  const [lang, setLang] = useState(getCurrentLang());

  useEffect(() => {
    const handleLangChange = (event) => {
      setLang(event.detail);
    };

    window.addEventListener('langChanged', handleLangChange);

    return () => {
      window.removeEventListener('langChanged', handleLangChange);
    };
  }, []);

  const texts = NAV_CONTENT[lang] || {};
  return (
    <nav>
      <a href={HOME_PAGE_PATH}>{texts.home || '首页'}</a>
      <a href={LOGIN_PAGE_PATH}>{texts.login || '登录'}</a>
      <a href={REGISTER_PAGE_PATH}>{texts.register || '注册'}</a>
      <LanguageSwitcher />
      <ThemeToggle lang={lang} />
    </nav>
  );
}
