import { ThemeProvider } from '../context/ThemeContext.jsx';
import { LanguageProvider } from '../context/LanguageContext.jsx';
import NavBar from './NavBar.jsx';

export default function NavBarWrapper({ initialLang }) {
  return (
    <ThemeProvider>
      <LanguageProvider initialLang={initialLang}>
        <NavBar />
      </LanguageProvider>
    </ThemeProvider>
  );
}
