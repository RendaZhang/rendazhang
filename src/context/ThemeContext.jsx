import { createContext, useContext, useEffect, useState } from 'react';

const defaultContext = {
  darkMode: false,
  // noop toggle when provider is absent
  toggle: () => {}
};

const ThemeContext = createContext(defaultContext);

export const useTheme = () => useContext(ThemeContext) || defaultContext;

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggle = () => setDarkMode((m) => !m);

  return <ThemeContext.Provider value={{ darkMode, toggle }}>{children}</ThemeContext.Provider>;
}
