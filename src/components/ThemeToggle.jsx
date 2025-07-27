import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { NAV_CONTENT } from '../content/navContent.js';
import { getCurrentLang } from '../utils/lang.js';

export default function ThemeToggle({ lang: langProp }) {
  const { darkMode, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const optionsRef = useRef(null);
  const lang = langProp || getCurrentLang();
  const texts = (NAV_CONTENT[lang] && NAV_CONTENT[lang].theme) || {};

  useEffect(() => {
    function handleClickOutside(e) {
      const target = e.target;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        (!optionsRef.current || !optionsRef.current.contains(target))
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelect = (isDark) => {
    setTheme(isDark);
    setOpen(false);
  };

  return (
    <div className="theme-toggle-wrapper">
      <button
        ref={buttonRef}
        className="theme-toggle-main"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {texts.button || '切换主题'}
      </button>
      {open && (
        <div ref={optionsRef} className="theme-options">
          <button
            className={`theme-option light ${!darkMode ? 'active' : ''}`}
            aria-label={texts.light || '切换到浅色模式'}
            title={texts.light || '切换到浅色模式'}
            onClick={() => handleSelect(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 18a6 6 0 110-12 6 6 0 010 12z" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="4" y1="12" x2="2" y2="12" />
                <line x1="22" y1="12" x2="20" y2="12" />
                <line x1="5.64" y1="5.64" x2="4.22" y2="4.22" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="5.64" y1="18.36" x2="4.22" y2="19.78" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          </button>
          <button
            className={`theme-option dark ${darkMode ? 'active' : ''}`}
            aria-label={texts.dark || '切换到深色模式'}
            title={texts.dark || '切换到深色模式'}
            onClick={() => handleSelect(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
