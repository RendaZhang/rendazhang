import { ThemeToggle, LanguageSelector, AvatarIcon, LocalizedSection } from '../ui';
import HamburgerMenu from './HamburgerMenu';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH } from '../../constants';
import { NAV_CONTENT } from '../../content';
import type { ReactElement } from 'react';

export default function NavBar(): ReactElement {
  // 不再根据当前语言只渲染一种文本，避免刷新时语言切换产生闪烁
  const textsEn = NAV_CONTENT.en;
  const textsZh = NAV_CONTENT.zh;

  return (
    <nav>
      <div className="c-nav-left">
        <HamburgerMenu />
        <a href={HOME_PAGE_PATH} className="c-nav-logo">
          <LocalizedSection zhContent={textsZh.home} enContent={textsEn.home} />
        </a>
      </div>
      <div className="c-nav-right">
        <LanguageSelector />
        <ThemeToggle />
        <a href={LOGIN_PAGE_PATH} aria-label="Login" className="c-avatar-link">
          <AvatarIcon />
        </a>
      </div>
    </nav>
  );
}
