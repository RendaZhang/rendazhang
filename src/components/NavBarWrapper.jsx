import React from 'react';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import NavBar from './NavBar.jsx';

export default function NavBarWrapper() {
  return (
    <ThemeProvider>
      <NavBar />
    </ThemeProvider>
  );
}
