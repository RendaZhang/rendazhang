import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const mounted = useRef(false);

  // Apply the stored preference immediately after hydration
  useLayoutEffect(() => {
    try {
      if (document.documentElement.classList.contains('dark-mode')) {
        setDarkMode(true);
        return;
      }
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark') setDarkMode(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    document.documentElement.classList.toggle('dark-mode', darkMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const toggle = () => setDarkMode((m) => !m);

  return <ThemeContext.Provider value={{ darkMode, toggle }}>{children}</ThemeContext.Provider>;
}
