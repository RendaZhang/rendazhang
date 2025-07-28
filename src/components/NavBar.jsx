import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from '../config.js';
import { NAV_CONTENT } from '../content/navContent.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function NavBar() {
  const languageContext = useLanguage() || {};

  // 不再根据当前语言只渲染一种文本，避免刷新时语言切换产生闪烁
  const textsEn = NAV_CONTENT.en;
  const textsZh = NAV_CONTENT.zh;

  return (
    <nav>
      <a href={HOME_PAGE_PATH}>
        <span className="lang-zh">{textsZh.home}</span>
        <span className="lang-en">{textsEn.home}</span>
      </a>
      <a href={LOGIN_PAGE_PATH}>
        <span className="lang-zh">{textsZh.login}</span>
        <span className="lang-en">{textsEn.login}</span>
      </a>
      <a href={REGISTER_PAGE_PATH}>
        <span className="lang-zh">{textsZh.register}</span>
        <span className="lang-en">{textsEn.register}</span>
      </a>
      <LanguageSwitcher />
      <ThemeToggle />
    </nav>
  );
}
