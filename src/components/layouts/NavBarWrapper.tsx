import { ThemeProvider, I18nProvider, AuthProvider } from '../providers';
import NavBar from './NavBar';
import ErrorBoundary from '../ErrorBoundary';
import type { NavigationRoute } from '../../content/navContent';
import type { ReactNode, ReactElement } from 'react';

interface NavBarWrapperProps {
  initialLang?: string;
  showNav?: boolean;
  currentRoute?: NavigationRoute;
  children?: ReactNode;
}

export default function NavBarWrapper({
  initialLang,
  showNav = true,
  currentRoute,
  children
}: NavBarWrapperProps): ReactElement {
  return (
    <ThemeProvider>
      <I18nProvider initialLang={initialLang}>
        <AuthProvider>
          <ErrorBoundary>
            {showNav && <NavBar currentRoute={currentRoute} />}
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
