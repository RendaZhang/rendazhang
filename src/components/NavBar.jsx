import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from '../config.js';
import { NAV_CONTENT } from '../content/navContent.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function NavBar() {
  const { lang } = useLanguage();
  const texts = NAV_CONTENT[lang.startsWith('zh') ? 'zh' : 'en'] || {};
  return (
    <nav>
      <a href={HOME_PAGE_PATH}>{texts.home || 'Home'}</a>
      <a href={LOGIN_PAGE_PATH}>{texts.login || '登录'}</a>
      <a href={REGISTER_PAGE_PATH}>{texts.register || '注册'}</a>
      <LanguageSwitcher />
      <ThemeToggle />
    </nav>
  );
}
