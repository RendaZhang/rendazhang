import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { NAV_CONTENT, getNavigationItems } from '../../content';
import { useLanguage, useAuth } from '../providers';
import { LocalizedSection } from '../ui';

const DRAWER_ID = 'site-navigation-drawer';
const DESKTOP_NAVIGATION_QUERY = '(min-width: 64.0625rem)';
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
  );
}

export default function HamburgerMenu(): ReactElement {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { lang } = useLanguage();
  const { isLoggedIn } = useAuth();

  const textsEn = NAV_CONTENT.en;
  const textsZh = NAV_CONTENT.zh;
  const items = getNavigationItems(isLoggedIn);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const desktopNavigation = window.matchMedia(DESKTOP_NAVIGATION_QUERY);
    const handleBreakpointChange = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        setOpen(false);
      }
    };

    desktopNavigation.addEventListener('change', handleBreakpointChange);
    if (desktopNavigation.matches) {
      setOpen(false);
    }

    return () => desktopNavigation.removeEventListener('change', handleBreakpointChange);
  }, []);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== 'Tab' || !menuRef.current) {
        return;
      }

      const focusableElements = getFocusableElements(menuRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) {
        return;
      }

      const activeElement = document.activeElement;
      if (!activeElement || !menuRef.current.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [closeMenu, open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`c-hamburger-btn${open ? ' is-open' : ''}`}
        aria-label={lang === 'en' ? textsEn.menu : textsZh.menu}
        aria-controls={DRAWER_ID}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      {mounted &&
        open &&
        createPortal(
          <>
            <div
              className="c-side-menu-overlay is-open"
              aria-hidden="true"
              onClick={() => closeMenu(true)}
            />
            <div
              ref={menuRef}
              id={DRAWER_ID}
              className="c-side-menu is-open"
              role="dialog"
              aria-modal="true"
              aria-label={lang === 'en' ? textsEn.menu : textsZh.menu}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="c-side-menu-close"
                onClick={() => closeMenu(true)}
              >
                <LocalizedSection zhContent={textsZh.closeMenu} enContent={textsEn.closeMenu} />
                <span className="c-side-menu-close-icon" aria-hidden="true">
                  ×
                </span>
              </button>
              <nav
                className="c-side-menu-links"
                aria-label={lang === 'en' ? textsEn.menu : textsZh.menu}
              >
                {items.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="c-side-menu-link"
                    onClick={() => closeMenu(false)}
                  >
                    <LocalizedSection
                      zhContent={textsZh.drawer[item.key]}
                      enContent={textsEn.drawer[item.key]}
                    />
                  </a>
                ))}
              </nav>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
