import { ThemeToggle, LanguageSelector, AvatarIcon, LocalizedSection } from '../ui';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH, IMAGE_PATHS } from '../../constants';
import { NAV_CONTENT } from '../../content';
import { useLanguage } from '../providers';
import { useEffect, useState, type ComponentType, type ReactElement } from 'react';

// Server-side rendering provides a static navigation structure.

export default function NavBar(): ReactElement {
  // 不再根据当前语言只渲染一种文本，避免刷新时语言切换产生闪烁
  const { lang } = useLanguage();
  const [HamburgerMenu, setHamburgerMenu] = useState<ComponentType | null>(null);
  const textsEn = NAV_CONTENT.en;
  const textsZh = NAV_CONTENT.zh;

  useEffect(() => {
    import('./HamburgerMenu').then((mod) => {
      setHamburgerMenu(() => mod.default);
    });
  }, []);

  return (
    <nav>
      <div className="c-nav-left">
        {HamburgerMenu && <HamburgerMenu />}
        <a
          href={HOME_PAGE_PATH}
          aria-label={lang === 'en' ? textsEn.home : textsZh.home}
          className="c-nav-logo"
        >
          <img src={IMAGE_PATHS.LOGO_V4} alt="" className="c-nav-logo-icon" />
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
