import {
  useState,
  useId,
  useRef,
  useEffect,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement
} from 'react';
import { useLanguage } from '../../providers';

export default function LanguageSelector(): ReactElement {
  const { lang, updateLang } = useLanguage();
  const [open, setOpen] = useState<boolean>(false);
  const optionsId = useId();
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
        className="c-nav-control c-language-selector-main"
        aria-controls={open ? optionsId : undefined}
        aria-expanded={open}
        aria-label={lang === 'en' ? 'Change language' : '切换语言'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span lang="zh-CN" aria-hidden="true">
          中
        </span>
        <span aria-hidden="true">／</span>
        <span lang="en" aria-hidden="true">
          EN
        </span>
      </button>
      {open && (
        <div
          ref={optionsRef}
          id={optionsId}
          className="c-language-options"
          role="group"
          aria-label={lang === 'en' ? 'Language' : '语言'}
        >
          <button
            type="button"
            className="c-nav-control c-language-option"
            lang="zh-CN"
            aria-pressed={lang === 'zh-CN'}
            onClick={() => handleSelect('zh-CN')}
          >
            中文
          </button>
          <button
            type="button"
            className="c-nav-control c-language-option"
            lang="en"
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
