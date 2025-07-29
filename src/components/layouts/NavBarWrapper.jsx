import { ThemeProvider, I18nProvider } from '../providers';
import NavBar from './NavBar.jsx';

export default function NavBarWrapper({ initialLang, showNav = true, children }) {
  return (
    <ThemeProvider>
      <I18nProvider initialLang={initialLang}>
        {showNav && <NavBar />}
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
