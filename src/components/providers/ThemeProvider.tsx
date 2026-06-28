import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ReactElement
} from 'react';
import { THEME_PALETTE_STORAGE_KEY, THEME_STORAGE_KEY } from '../../constants';
import {
  DEFAULT_UI_PREFERENCES,
  isThemePalette,
  persistThemePalette,
  persistThemeMode,
  readStoredThemePalette,
  readStoredThemeMode,
  setPreferencesReady,
  setThemePalette,
  setThemeMode,
  type ThemeMode,
  type ThemePalette
} from '../../stores/uiPreferencesStore';
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

const defaultContext: ThemeContextValue = {
  darkMode: false,
  themePalette: DEFAULT_UI_PREFERENCES.themePalette,
  toggle: () => {},
  setTheme: () => {},
  setPalette: () => {}
};

const ThemeContext = createContext<ThemeContextValue>(defaultContext);

export const useTheme = (): ThemeContextValue => useContext(ThemeContext) || defaultContext;

interface ThemeProviderProps {
  children: ReactNode;
}

const toThemeMode = (enabled: boolean): ThemeMode => (enabled ? 'dark' : 'light');
const toInitialPalette = (): ThemePalette => {
  if (typeof window === 'undefined') {
    return DEFAULT_UI_PREFERENCES.themePalette;
  }

  const initialPalette = document.documentElement.dataset.initialPalette;
  return isThemePalette(initialPalette) ? initialPalette : DEFAULT_UI_PREFERENCES.themePalette;
};

export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  // 使用 ref 跟踪初始状态是否已设置
  const initialSet = useRef<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // 从 DOM 获取初始值（由内联脚本设置）
    if (typeof window !== 'undefined') {
      return document.documentElement.dataset.initialTheme === 'dark';
    }
    return false; // SSR默认值
  });
  const [themePalette, setThemePaletteState] = useState<ThemePalette>(() => toInitialPalette());

  // 同步主题状态到 DOM 和存储
  useEffect(() => {
    // 1. 只在客户端执行
    if (typeof window === 'undefined') return;

    // 2. 首次渲染时设置初始状态
    if (!initialSet.current) {
      initialSet.current = true;

      // 优先读取 DOM 属性
      const hasDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      logger.log('ThemeProvider hasDarkTheme: ' + hasDarkTheme);

      // 其次读取存储
      let storedTheme: ThemeMode = 'light';
      let storedPalette: ThemePalette = DEFAULT_UI_PREFERENCES.themePalette;
      try {
        storedTheme = readStoredThemeMode(storage, THEME_STORAGE_KEY);
        logger.log('ThemeProvider stored: ' + storedTheme);
      } catch (e) {
        logger.log('Failed to get stored with THEME_STORAGE_KEY' + THEME_STORAGE_KEY);
        Sentry.captureException(e);
      }
      try {
        storedPalette = readStoredThemePalette(storage, THEME_PALETTE_STORAGE_KEY);
        logger.log('ThemeProvider storedPalette: ' + storedPalette);
      } catch (e) {
        logger.log(
          'Failed to get stored with THEME_PALETTE_STORAGE_KEY' + THEME_PALETTE_STORAGE_KEY
        );
        Sentry.captureException(e);
      }

      // 设置初始状态
      const shouldBeDark = hasDarkTheme || storedTheme === 'dark';
      const domPalette = document.documentElement.getAttribute('data-palette');
      const shouldUsePalette = isThemePalette(domPalette) ? domPalette : storedPalette;
      setThemeMode(toThemeMode(shouldBeDark));
      setThemePalette(shouldUsePalette);
      setPreferencesReady(true);
      setDarkMode(shouldBeDark);
      setThemePaletteState(shouldUsePalette);

      // 确保 DOM 状态正确
      document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-palette', shouldUsePalette);

      logger.log('ThemeProvider shouldBeDark: ' + shouldBeDark);
      return;
    }

    // 3. 后续状态变化时同步
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-palette', themePalette);
    setThemeMode(toThemeMode(darkMode));
    setThemePalette(themePalette);
    setPreferencesReady(true);
    try {
      logger.log('ThemeProvider darkMode: ' + darkMode);
      persistThemeMode(toThemeMode(darkMode), storage, THEME_STORAGE_KEY);
      persistThemePalette(themePalette, storage, THEME_PALETTE_STORAGE_KEY);
    } catch (e) {
      logger.error('Failed to persist theme preferences');
      Sentry.captureException(e);
    }
  }, [darkMode, themePalette]);

  const toggle = () => setDarkMode((prev) => !prev);
  const setTheme = (isDark: boolean) => setDarkMode(Boolean(isDark));
  const setPalette = (palette: ThemePalette) => setThemePaletteState(palette);

  return (
    <ThemeContext.Provider value={{ darkMode, themePalette, toggle, setTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}
