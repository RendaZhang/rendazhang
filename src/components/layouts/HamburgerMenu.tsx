import { useState, useEffect, useRef, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import {
  HOME_PAGE_PATH,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH,
  PROFILE_PAGE_PATH
} from '../../constants';
import { NAV_CONTENT } from '../../content';
import { useLanguage, useAuth } from '../providers';
import { LocalizedSection } from '../ui';

export default function HamburgerMenu(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const { isLoggedIn } = useAuth();

  const textsEn = NAV_CONTENT.en.drawer;
  const textsZh = NAV_CONTENT.zh.drawer;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest('.c-hamburger-btn')
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open, mounted]);

  const baseItems: { href: string; key: keyof typeof textsEn }[] = [
    { href: HOME_PAGE_PATH, key: 'home' },
    { href: CHAT_PAGE_PATH, key: 'chat' },
    { href: CERTIFICATIONS_PAGE_PATH, key: 'certs' },
    { href: DOCS_PAGE_PATH, key: 'docs' }
  ];

  const items = isLoggedIn
    ? [...baseItems, { href: PROFILE_PAGE_PATH, key: 'profile' as keyof typeof textsEn }]
    : baseItems;

  return (
    <>
      <button
        className={`c-hamburger-btn${open ? ' is-open' : ''}`}
        aria-label={NAV_CONTENT[lang as keyof typeof NAV_CONTENT]?.menu || 'Menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      {mounted &&
        createPortal(
          <>
            <div
              className={`c-side-menu-overlay${open ? ' is-open' : ''}`}
              onClick={() => setOpen(false)}
            />
            <div ref={menuRef} className={`c-side-menu${open ? ' is-open' : ''}`}>
              {items.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="c-side-menu-link"
                  onClick={() => setOpen(false)}
                >
                  <LocalizedSection zhContent={textsZh[item.key]} enContent={textsEn[item.key]} />
                </a>
              ))}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
