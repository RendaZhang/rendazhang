import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../providers';
import { NAV_CONTENT } from '../../../content';
import { useLanguage } from '../../providers';
import { LocalizedSection, ThemeIcon, SunIcon, MoonIcon } from '..';

export default function ThemeToggle() {
  const { darkMode, setTheme } = useTheme();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  // 渲染中英文两套文本，避免首次挂载语言切换造成闪烁
  const textsZh = NAV_CONTENT.zh.theme;
  const textsEn = NAV_CONTENT.en.theme;
  const texts = NAV_CONTENT[lang as keyof typeof NAV_CONTENT]?.theme || {};

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
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

  const handleSelect = (isDark: boolean) => {
    setTheme(isDark);
    setOpen(false);
  };

  return (
    <div className="c-theme-toggle-wrapper">
      <button
        ref={buttonRef}
        className="c-theme-toggle-main"
        aria-expanded={open}
        aria-label={lang === 'en' ? textsEn.button : textsZh.button}
        onClick={() => setOpen((prev) => !prev)}
      >
        <LocalizedSection zhContent={textsZh.button} enContent={textsEn.button} />
        <ThemeIcon />
      </button>
      {open && (
        <div ref={optionsRef} className="c-theme-options">
          <button
            className={`c-theme-option is-light ${!darkMode ? 'is-active' : ''}`}
            aria-label={texts.light || '切换到浅色模式'}
            title={texts.light || '切换到浅色模式'}
            onClick={() => handleSelect(false)}
          >
            <SunIcon size={20} />
          </button>
          <button
            className={`c-theme-option is-dark ${darkMode ? 'is-active' : ''}`}
            aria-label={texts.dark || '切换到深色模式'}
            title={texts.dark || '切换到深色模式'}
            onClick={() => handleSelect(true)}
          >
            <MoonIcon size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
