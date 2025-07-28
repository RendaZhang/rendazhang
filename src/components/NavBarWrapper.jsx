import { ThemeProvider } from '../context/ThemeContext.jsx';
import { LanguageProvider } from '../context/LanguageContext.jsx';
import NavBar from './NavBar.jsx';

export default function NavBarWrapper({ initialLang, showNav = true, children }) {
  return (
    <ThemeProvider>
      <LanguageProvider initialLang={initialLang}>
        {showNav && <NavBar />}
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
