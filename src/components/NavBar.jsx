import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from '../config.js';
import { NAV_CONTENT } from '../content/navContent.js';
import { getCurrentLang } from '../utils/lang.js';

export default function NavBar({ lang: langProp }) {
  const [lang, setLang] = useState(langProp || getCurrentLang());

  useEffect(() => {
    const current = getCurrentLang();
    if (current !== lang) {
      setLang(current);
    }
  }, []);

  const texts = NAV_CONTENT[lang] || {};
  return (
    <nav>
      <a href={HOME_PAGE_PATH}>{texts.home || 'Home'}</a>
      <a href={LOGIN_PAGE_PATH}>{texts.login || '登录'}</a>
      <a href={REGISTER_PAGE_PATH}>{texts.register || '注册'}</a>
      <LanguageSwitcher />
      <ThemeToggle lang={lang} />
    </nav>
  );
}
