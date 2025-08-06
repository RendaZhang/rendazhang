import { ThemeProvider, I18nProvider } from '../providers';
import NavBar from './NavBar.tsx';
import ErrorBoundary from '../ErrorBoundary.jsx';
import type { ReactNode, ReactElement } from 'react';

interface NavBarWrapperProps {
  initialLang?: string;
  showNav?: boolean;
  children?: ReactNode;
}

export default function NavBarWrapper({
  initialLang,
  showNav = true,
  children
}: NavBarWrapperProps): ReactElement {
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
