import React from 'react';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import NavBar from './NavBar.jsx';

export default function NavBarWrapper({ lang }) {
  return (
    <ThemeProvider>
      <NavBar lang={lang} />
    </ThemeProvider>
  );
}
