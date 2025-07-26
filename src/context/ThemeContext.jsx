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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    } catch {}
    return false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const toggle = () => setDarkMode((m) => !m);

  return <ThemeContext.Provider value={{ darkMode, toggle }}>{children}</ThemeContext.Provider>;
}
