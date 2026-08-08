import {
  useState,
  useRef,
  useEffect,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement
} from 'react';
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
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (open && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  return (
    <div className="c-language-selector-wrapper" onBlur={handleBlur} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className="c-language-selector-main"
        aria-controls="language-options"
        aria-expanded={open}
        aria-label={lang === 'en' ? 'Change language' : '切换语言'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <LocalizedSection zhContent="中文" enContent="English" />
        <LanguageIcon />
      </button>
      {open && (
        <div
          ref={optionsRef}
          id="language-options"
          className="c-language-options"
          role="group"
          aria-label={lang === 'en' ? 'Language' : '语言'}
        >
          <button
            type="button"
            className={`c-language-option ${lang === 'zh-CN' ? 'is-active' : ''}`}
            aria-pressed={lang === 'zh-CN'}
            onClick={() => handleSelect('zh-CN')}
          >
            中文
          </button>
          <button
            type="button"
            className={`c-language-option ${lang === 'en' ? 'is-active' : ''}`}
            aria-pressed={lang === 'en'}
            onClick={() => handleSelect('en')}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}
