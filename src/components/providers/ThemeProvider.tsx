import { createContext, useContext, useEffect, type ReactNode, type ReactElement } from 'react';
import { THEME_PALETTE_STORAGE_KEY, THEME_STORAGE_KEY } from '../../constants';
import {
  DEFAULT_UI_PREFERENCES,
  getUiPreferencesSnapshot,
  initializeUiPreferences,
  isThemePalette,
  persistThemePalette,
  persistThemeMode,
  readStoredThemePalette,
  readStoredThemeMode,
  setThemePalette,
  setThemeMode,
  type ThemeMode,
  type ThemePalette
} from '../../stores/uiPreferencesStore';
import useUiPreferences from '../../hooks/useUiPreferences';
import storage from '../../utils/storage';
import logger from '../../utils/logger';
import * as Sentry from '@sentry/react';

interface ThemeContextValue {
  darkMode: boolean;
  themePalette: ThemePalette;
  toggle: () => void;
  setTheme: (isDark: boolean) => void;
  setPalette: (palette: ThemePalette) => void;
}

function setTheme(isDark: boolean): void {
  setThemeMode(isDark ? 'dark' : 'light');
}

function setPalette(palette: ThemePalette): void {
  setThemePalette(palette);
}

function toggle(): void {
  setTheme(getUiPreferencesSnapshot().themeMode !== 'dark');
}

const defaultContext: ThemeContextValue = {
  darkMode: false,
  themePalette: DEFAULT_UI_PREFERENCES.themePalette,
  toggle,
  setTheme,
  setPalette
};

const ThemeContext = createContext<ThemeContextValue>(defaultContext);

export const useTheme = (): ThemeContextValue => useContext(ThemeContext) || defaultContext;

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  const { themeMode, themePalette, preferencesReady } = useUiPreferences();
  const darkMode = themeMode === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    let storedTheme: ThemeMode = 'light';
    let storedPalette = DEFAULT_UI_PREFERENCES.themePalette;

    try {
      storedTheme = readStoredThemeMode(storage, THEME_STORAGE_KEY);
      storedPalette = readStoredThemePalette(storage, THEME_PALETTE_STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to read theme preferences');
      Sentry.captureException(error);
    }

    const domPalette = root.dataset.palette;
    initializeUiPreferences({
      themeMode: root.dataset.theme === 'dark' || storedTheme === 'dark' ? 'dark' : 'light',
      themePalette: isThemePalette(domPalette) ? domPalette : storedPalette,
      preferencesReady: true
    });
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;

    const root = document.documentElement;
    root.dataset.theme = themeMode;
    root.dataset.palette = themePalette;
    try {
      persistThemeMode(themeMode, storage, THEME_STORAGE_KEY);
      persistThemePalette(themePalette, storage, THEME_PALETTE_STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to persist theme preferences');
      Sentry.captureException(error);
    }
  }, [preferencesReady, themeMode, themePalette]);

  return (
    <ThemeContext.Provider value={{ darkMode, themePalette, toggle, setTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}
