import {
  ThemeToggle,
  LanguageSelector,
  AvatarIcon,
  LogoutIcon,
  LoggedInIcon,
  LocalizedSection,
  ConfirmDialog
} from '../ui';
import {
  HOME_PAGE_PATH,
  LOGIN_PAGE_PATH,
  IMAGE_PATHS,
  LOGIN_IDENTIFIER_KEY
} from '../../constants';
import { NAV_CONTENT } from '../../content';
import { useLanguage, useAuth } from '../providers';
import { storage } from '../../utils';
import { useState, type ReactElement, type CSSProperties } from 'react';
import HamburgerMenu from './HamburgerMenu';

// Server-side rendering provides a static navigation structure.

export default function NavBar(): ReactElement {
  // 不再根据当前语言只渲染一种文本，避免刷新时语言切换产生闪烁
  const { lang } = useLanguage();
  const { logout } = useAuth();
  const textsEn = NAV_CONTENT.en;
  const textsZh = NAV_CONTENT.zh;
  const [showConfirm, setShowConfirm] = useState(false); // controls visibility of logout confirmation
  const [isLoggingOut, setIsLoggingOut] = useState(false); // disables logout button and shows spinner

  // Show confirmation dialog before logging out
  const openLogoutDialog = (): void => {
    setShowConfirm(true);
  };

  // Hide confirmation dialog
  const closeLogoutDialog = (): void => {
    setShowConfirm(false);
  };

  // Execute logout flow and redirect to login page
  const handleLogout = async (): Promise<void> => {
    closeLogoutDialog();
    setIsLoggingOut(true); // trigger spinner and disable button
    await logout();
    storage.remove(LOGIN_IDENTIFIER_KEY);
    window.location.href = LOGIN_PAGE_PATH;
  };

  return (
    <div className="c-nav-container">
      <nav>
        <div className="c-nav-left">
          <HamburgerMenu />
          <a
            href={HOME_PAGE_PATH}
            aria-label={lang === 'en' ? textsEn.home : textsZh.home}
            className="c-nav-logo"
          >
            {/* Display both home-link variants so CSS can toggle visibility
                via `data-logged-in` without causing hydration flicker. */}
            <span className="c-nav-home-logged-out">
              <img src={IMAGE_PATHS.LOGO_V4} alt="" className="c-nav-logo-icon" />
              <LocalizedSection zhContent={textsZh.home} enContent={textsEn.home} />
            </span>
            <span className="c-nav-home-logged-in">
              <LoggedInIcon />
              <LocalizedSection zhContent={textsZh.loggedIn} enContent={textsEn.loggedIn} />
            </span>
          </a>
        </div>
        <div className="c-nav-right">
          <LanguageSelector />
          <ThemeToggle />
          <a
            href={LOGIN_PAGE_PATH}
            aria-label={lang === 'en' ? textsEn.login : textsZh.login}
            className="c-avatar-link c-login-link"
          >
            <AvatarIcon />
          </a>
          <button
            type="button"
            onClick={openLogoutDialog}
            aria-label={lang === 'en' ? textsEn.logout : textsZh.logout}
            className="c-avatar-link c-logout-link"
            disabled={isLoggingOut} // prevent repeated clicks during logout
          >
            {isLoggingOut ? (
              <span
                className="c-spinner"
                style={
                  {
                    '--spinner-size': 'var(--space-5)',
                    '--spinner-color': 'var(--color-nav-text)'
                  } as CSSProperties
                }
                aria-hidden="true"
              /> /* Show loading indicator while logging out */
            ) : (
              <LogoutIcon />
            )}
          </button>
          {/* Logout confirmation dialog */}
          <ConfirmDialog
            isOpen={showConfirm}
            message={
              <LocalizedSection
                zhContent={textsZh.logoutConfirm}
                enContent={textsEn.logoutConfirm}
              />
            }
            confirmLabel={
              <LocalizedSection zhContent={textsZh.logout} enContent={textsEn.logout} />
            }
            cancelLabel={<LocalizedSection zhContent={textsZh.cancel} enContent={textsEn.cancel} />}
            onConfirm={handleLogout}
            onCancel={closeLogoutDialog}
          />
        </div>
      </nav>
    </div>
  );
}
