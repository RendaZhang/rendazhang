import {
  useState,
  useId,
  useRef,
  useEffect,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent
} from 'react';
import { useTheme } from '../../providers';
import { NAV_CONTENT } from '../../../content';
import { useUiPreferences } from '../../../hooks';
import { useLanguage } from '../../providers';
import { ThemeIcon, SunIcon, MoonIcon } from '..';
import ControlHint from '../data-display/ControlHint';
import { THEME_PALETTES, type ThemePalette } from '../../../stores/uiPreferencesStore';

export default function ThemeToggle({ language }: { language?: string } = {}) {
  const { darkMode, themePalette: providerThemePalette, setTheme, setPalette } = useTheme();
  const { lang: currentLanguage } = useLanguage();
  const lang = language ?? currentLanguage;
  const { themeMode, themePalette, preferencesReady } = useUiPreferences();
  const [open, setOpen] = useState(false);
  const optionsId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const selectedThemeMode = preferencesReady ? themeMode : darkMode ? 'dark' : 'light';
  const selectedThemePalette = preferencesReady ? themePalette : providerThemePalette;
  const lightSelected = selectedThemeMode === 'light';
  const darkSelected = selectedThemeMode === 'dark';

  const textsZh = NAV_CONTENT.zh.theme;
  const textsEn = NAV_CONTENT.en.theme;
  const texts = lang === 'en' ? textsEn : textsZh;

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
    buttonRef.current?.focus();
  };

  const handlePaletteSelect = (palette: ThemePalette) => {
    setPalette(palette);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (open && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  return (
    <div className="c-theme-toggle-wrapper" onBlur={handleBlur} onKeyDown={handleKeyDown}>
      <ControlHint label={texts.button} disabled={open}>
        <button
          ref={buttonRef}
          type="button"
          className="c-nav-control c-theme-toggle-main"
          aria-controls={open ? optionsId : undefined}
          aria-expanded={open}
          aria-label={texts.button}
          onClick={() => setOpen((prev) => !prev)}
        >
          <ThemeIcon />
        </button>
      </ControlHint>
      {open && (
        <div ref={optionsRef} id={optionsId} className="c-theme-options">
          <div
            className="c-theme-mode-options"
            role="group"
            aria-label={texts.button || textsZh.button}
          >
            <ControlHint label={texts.light} side="above">
              <button
                type="button"
                className={`c-nav-control c-theme-option is-light ${lightSelected ? 'is-active' : ''}`}
                aria-label={texts.light || '切换到浅色模式'}
                aria-pressed={lightSelected}
                onClick={() => handleSelect(false)}
              >
                <SunIcon size={20} />
              </button>
            </ControlHint>
            <ControlHint label={texts.dark} side="above">
              <button
                type="button"
                className={`c-nav-control c-theme-option is-dark ${darkSelected ? 'is-active' : ''}`}
                aria-label={texts.dark || '切换到深色模式'}
                aria-pressed={darkSelected}
                onClick={() => handleSelect(true)}
              >
                <MoonIcon size={20} />
              </button>
            </ControlHint>
          </div>
          <div
            className="c-theme-palette-options"
            role="group"
            aria-label={texts.paletteGroup || '主题调色板'}
          >
            {THEME_PALETTES.map((palette) => {
              const selected = selectedThemePalette === palette;
              const label = texts.palettes?.[palette] || palette;

              return (
                <button
                  key={palette}
                  type="button"
                  className={`c-nav-control c-theme-option c-theme-palette-option is-palette-${palette} ${
                    selected ? 'is-active' : ''
                  }`}
                  aria-pressed={selected}
                  onClick={() => handlePaletteSelect(palette)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
