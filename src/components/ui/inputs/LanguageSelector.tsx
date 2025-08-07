import { useState, useRef, useEffect, type ReactElement } from 'react';
import { useLanguage } from '../../providers';
import { LocalizedSection } from '..';

function LanguageIcon({ size = 20 }: { size?: number }): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function LanguageSelector(): ReactElement {
  const { lang, updateLang } = useLanguage();
  const [open, setOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        optionsRef.current &&
        !optionsRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelect = (code: string): void => {
    updateLang(code);
    setOpen(false);
  };

  return (
    <div className="language-selector-wrapper">
      <button
        ref={buttonRef}
        className="language-selector-main"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={lang === 'en' ? 'Change language' : '切换语言'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <LocalizedSection zhContent="中文" enContent="English" />
        <LanguageIcon />
      </button>
      {open && (
        <div ref={optionsRef} className="language-options" role="listbox">
          <button
            className={`language-option ${lang === 'zh-CN' ? 'active' : ''}`}
            role="option"
            aria-selected={lang === 'zh-CN'}
            onClick={() => handleSelect('zh-CN')}
          >
            中文
          </button>
          <button
            className={`language-option ${lang === 'en' ? 'active' : ''}`}
            role="option"
            aria-selected={lang === 'en'}
            onClick={() => handleSelect('en')}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}
