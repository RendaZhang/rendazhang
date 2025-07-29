import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import HamburgerMenu from './HamburgerMenu.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH } from '../config.js';
import AvatarIcon from './AvatarIcon.jsx';
import { NAV_CONTENT } from '../content/navContent.js';
import LocalizedSection from './LocalizedSection.jsx';

export default function NavBar() {
  // 不再根据当前语言只渲染一种文本，避免刷新时语言切换产生闪烁
  const textsEn = NAV_CONTENT.en;
  const textsZh = NAV_CONTENT.zh;

  return (
    <nav>
      <HamburgerMenu />
      <a href={HOME_PAGE_PATH}>
        <LocalizedSection zhContent={textsZh.home} enContent={textsEn.home} />
      </a>
      <LanguageSelector />
      <ThemeToggle />
      <a href={LOGIN_PAGE_PATH} aria-label="Login" className="avatar-link">
        <AvatarIcon />
      </a>
    </nav>
  );
}
