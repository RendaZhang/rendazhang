import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import HamburgerMenu from './HamburgerMenu.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH } from '../config.js';
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
      <a href={LOGIN_PAGE_PATH} className="avatar-link" aria-label="Login">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="currentColor"
          />
        </svg>
      </a>
      <LanguageSwitcher />
      <ThemeToggle />
    </nav>
  );
}
