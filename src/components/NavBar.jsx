import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import HamburgerMenu from './HamburgerMenu.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from '../config.js';
import { NAV_CONTENT } from '../content/navContent.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LocalizedSection from './LocalizedSection.jsx';

export default function NavBar() {
  const languageContext = useLanguage() || {};

  // 不再根据当前语言只渲染一种文本，避免刷新时语言切换产生闪烁
  const textsEn = NAV_CONTENT.en;
  const textsZh = NAV_CONTENT.zh;

  return (
    <nav>
      <HamburgerMenu />
      <a href={HOME_PAGE_PATH}>
        <LocalizedSection zhContent={textsZh.home} enContent={textsEn.home} />
      </a>
      <a href={LOGIN_PAGE_PATH}>
        <LocalizedSection zhContent={textsZh.login} enContent={textsEn.login} />
      </a>
      <a href={REGISTER_PAGE_PATH}>
        <LocalizedSection zhContent={textsZh.register} enContent={textsEn.register} />
      </a>
      <LanguageSwitcher />
      <ThemeToggle />
    </nav>
  );
}
