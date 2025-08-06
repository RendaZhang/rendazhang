import { useState, useEffect, useRef } from 'react';
import {
  HOME_PAGE_PATH,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH
} from '../../constants/index.ts';
import { NAV_CONTENT } from '../../content';
import { useLanguage } from '../providers';
import { LocalizedSection } from '../ui';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { lang } = useLanguage();

  const textsEn = NAV_CONTENT.en.drawer;
  const textsZh = NAV_CONTENT.zh.drawer;

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest('.hamburger-btn')
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  const items = [
    { href: HOME_PAGE_PATH, key: 'home' },
    { href: CHAT_PAGE_PATH, key: 'chat' },
    { href: CERTIFICATIONS_PAGE_PATH, key: 'certs' },
    { href: DOCS_PAGE_PATH, key: 'docs' }
  ];

  return (
    <>
      <button
        className={`hamburger-btn${open ? ' open' : ''}`}
        aria-label={NAV_CONTENT[lang]?.menu || 'Menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`side-menu-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
      <div ref={menuRef} className={`side-menu${open ? ' open' : ''}`}>
        {items.map((item) => (
          <a key={item.key} href={item.href} onClick={() => setOpen(false)}>
            <LocalizedSection zhContent={textsZh[item.key]} enContent={textsEn[item.key]} />
          </a>
        ))}
      </div>
    </>
  );
}
