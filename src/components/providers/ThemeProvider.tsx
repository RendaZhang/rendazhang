import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type ReactElement } from 'react';
import { THEME_STORAGE_KEY } from '../../constants';
import storage from '../../utils/storage';
import * as Sentry from '@sentry/react';

interface ThemeContextValue {
  darkMode: boolean;
  toggle: () => void;
  setTheme: (isDark: boolean) => void;
}

const defaultContext: ThemeContextValue = {
  darkMode: false,
  toggle: () => {},
  setTheme: (_isDark: boolean) => {}
};

const ThemeContext = createContext<ThemeContextValue>(defaultContext);

export const useTheme = (): ThemeContextValue => useContext(ThemeContext) || defaultContext;

interface ThemeProviderProps {
  children: ReactNode;
}

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

  // 同步主题状态到 DOM 和存储
  useEffect(() => {
    // 1. 只在客户端执行
    if (typeof window === 'undefined') return;

    // 2. 首次渲染时设置初始状态
    if (!initialSet.current) {
      initialSet.current = true;

      // 优先读取 DOM 类名
      const hasDarkClass = document.documentElement.classList.contains('dark-mode');
      console.log('ThemeProvider hasDarkClass: ' + hasDarkClass);

      // 其次读取存储
      let storedValue = false;
      try {
        const stored = storage.get(THEME_STORAGE_KEY);
        console.log('ThemeProvider stored: ' + stored);
        storedValue = stored === 'dark';
        console.log('ThemeProvider storedValue: ' + storedValue);
      } catch (e) {
        console.log('Failed to get stored with THEME_STORAGE_KEY' + THEME_STORAGE_KEY);
        Sentry.captureException(e);
      }

      // 设置初始状态
      const shouldBeDark = hasDarkClass || storedValue;
      setDarkMode(shouldBeDark);

      // 确保 DOM 状态正确
      document.documentElement.classList.toggle('dark-mode', shouldBeDark);

      console.log('ThemeProvider shouldBeDark: ' + shouldBeDark);
      return;
    }

    // 3. 后续状态变化时同步
    document.documentElement.classList.toggle('dark-mode', darkMode);
    try {
      console.log('ThemeProvider darkMode: ' + darkMode);
      storage.set(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to set darkMode with THEME_STORAGE_KEY' + THEME_STORAGE_KEY);
      Sentry.captureException(e);
    }
  }, [darkMode]);

  const toggle = () => setDarkMode((prev) => !prev);
  const setTheme = (isDark: boolean) => setDarkMode(Boolean(isDark));

  return (
    <ThemeContext.Provider value={{ darkMode, toggle, setTheme }}>{children}</ThemeContext.Provider>
  );
}
