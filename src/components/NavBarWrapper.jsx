import { ThemeProvider } from '../context/ThemeContext.jsx';
import { LanguageProvider } from '../context/LanguageContext.jsx';
import NavBar from './NavBar.jsx';

export default function NavBarWrapper() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavBar />
      </LanguageProvider>
    </ThemeProvider>
  );
}
