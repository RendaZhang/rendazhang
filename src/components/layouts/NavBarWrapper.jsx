import { ThemeProvider, I18nProvider } from '../providers';
import NavBar from './NavBar.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';

export default function NavBarWrapper({ initialLang, showNav = true, children }) {
  return (
    <ThemeProvider>
      <I18nProvider initialLang={initialLang}>
        <ErrorBoundary>
          {showNav && <NavBar />}
          {children}
        </ErrorBoundary>
      </I18nProvider>
    </ThemeProvider>
  );
}
