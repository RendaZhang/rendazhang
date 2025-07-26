import { createContext, useContext, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '../config.js';

const defaultContext = {
  darkMode: false,
  // noop toggle when provider is absent
  toggle: () => {}
};

const ThemeContext = createContext(defaultContext);

export const useTheme = () => useContext(ThemeContext) || defaultContext;

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Lazily load stored preference after hydration to avoid SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark') setDarkMode(true);
      if (stored === 'light') setDarkMode(false);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const toggle = () => setDarkMode((m) => !m);

  return <ThemeContext.Provider value={{ darkMode, toggle }}>{children}</ThemeContext.Provider>;
}
