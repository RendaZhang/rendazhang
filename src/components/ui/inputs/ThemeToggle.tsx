import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../providers';
import { NAV_CONTENT } from '../../../content';
import { useUiPreferences } from '../../../hooks';
import { useLanguage } from '../../providers';
import { LocalizedSection, ThemeIcon, SunIcon, MoonIcon } from '..';
import { THEME_PALETTES, type ThemePalette } from '../../../stores/uiPreferencesStore';

export default function ThemeToggle() {
  const { darkMode, themePalette: providerThemePalette, setTheme, setPalette } = useTheme();
  const { lang } = useLanguage();
  const { themeMode, themePalette, preferencesReady } = useUiPreferences();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const selectedThemeMode = preferencesReady ? themeMode : darkMode ? 'dark' : 'light';
  const selectedThemePalette = preferencesReady ? themePalette : providerThemePalette;
  const lightSelected = selectedThemeMode === 'light';
  const darkSelected = selectedThemeMode === 'dark';

  // 渲染中英文两套文本，避免首次挂载语言切换造成闪烁
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
  };

  const handlePaletteSelect = (palette: ThemePalette) => {
    setPalette(palette);
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
          <div
            className="c-theme-mode-options"
            role="group"
            aria-label={texts.button || textsZh.button}
          >
            <button
              className={`c-theme-option is-light ${lightSelected ? 'is-active' : ''}`}
              aria-label={texts.light || '切换到浅色模式'}
              aria-pressed={lightSelected}
              title={texts.light || '切换到浅色模式'}
              onClick={() => handleSelect(false)}
            >
              <SunIcon size={20} />
            </button>
            <button
              className={`c-theme-option is-dark ${darkSelected ? 'is-active' : ''}`}
              aria-label={texts.dark || '切换到深色模式'}
              aria-pressed={darkSelected}
              title={texts.dark || '切换到深色模式'}
              onClick={() => handleSelect(true)}
            >
              <MoonIcon size={20} />
            </button>
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
                  className={`c-theme-option c-theme-palette-option is-palette-${palette} ${
                    selected ? 'is-active' : ''
                  }`}
                  aria-label={label}
                  aria-pressed={selected}
                  title={label}
                  onClick={() => handlePaletteSelect(palette)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
