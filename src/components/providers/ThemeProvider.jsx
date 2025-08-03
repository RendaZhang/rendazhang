import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { THEME_STORAGE_KEY } from '../../config.js';
import storage from '../../utils/storage.js';

const defaultContext = {
  darkMode: false,
  toggle: () => {},
  setTheme: () => {}
};

const ThemeContext = createContext(defaultContext);

export const useTheme = () => useContext(ThemeContext) || defaultContext;

export function ThemeProvider({ children }) {
  // 使用 ref 跟踪初始状态是否已设置
  const initialSet = useRef(false);

  const [darkMode, setDarkMode] = useState(() => {
    // 从DOM获取初始值（由内联脚本设置）
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

      // 其次读取存储
      let storedValue = false;
      try {
        const stored = storage.get(THEME_STORAGE_KEY);
        storedValue = stored === 'dark';
      } catch {}

      // 设置初始状态
      const shouldBeDark = hasDarkClass || storedValue;
      setDarkMode(shouldBeDark);

      // 确保 DOM 状态正确
      document.documentElement.classList.toggle('dark-mode', shouldBeDark);
      return;
    }

    // 3. 后续状态变化时同步
    document.documentElement.classList.toggle('dark-mode', darkMode);
    try {
      storage.set(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const toggle = () => setDarkMode((prev) => !prev);
  const setTheme = (isDark) => setDarkMode(Boolean(isDark));

  return (
    <ThemeContext.Provider value={{ darkMode, toggle, setTheme }}>{children}</ThemeContext.Provider>
  );
}
