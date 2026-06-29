import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  type ReactElement
} from 'react';
import { apiClient } from '../../services';
import { storage, logger, shouldSuppressAuthProbeError, hasStoredLoginSignal } from '../../utils';
import { LOGIN_STATE_KEY } from '../../constants';
import * as Sentry from '@sentry/react';
import {
  addSentryBreadcrumb,
  clearSentryUser,
  setAuthenticatedSentryUser
} from '../../utils/sentryContext';

interface AuthContextValue {
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return hasStoredLoginSignal();
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.loggedIn = isLoggedIn ? 'true' : 'false';
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const init = async () => {
      if (!hasStoredLoginSignal()) {
        addSentryBreadcrumb('auth.session.missing', { reason: 'no-login-signal' });
        clearSentryUser();
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await apiClient.auth.me();
        setAuthenticatedSentryUser(response.user);
        addSentryBreadcrumb('auth.session.valid', {
          authenticated: true,
          active: response.user.is_active
        });
        setIsLoggedIn(true);
        storage.set(LOGIN_STATE_KEY, true);
      } catch (e) {
        const status = (e as { status?: number }).status;
        if (status !== 401 && !shouldSuppressAuthProbeError(status)) {
          logger.error('AuthProvider init failed', e);
          Sentry.captureException(e);
          addSentryBreadcrumb('auth.session.error', { status }, 'warning');
        } else {
          addSentryBreadcrumb('auth.session.missing', { status });
        }
        clearSentryUser();
        setIsLoggedIn(false);
        storage.remove(LOGIN_STATE_KEY);
      }
    };
    void init();
  }, []);

  const logout = async (): Promise<void> => {
    try {
      await apiClient.auth.logout();
      addSentryBreadcrumb('auth.logout.success');
    } catch (e) {
      logger.error('AuthProvider logout failed', e);
      Sentry.captureException(e);
      addSentryBreadcrumb('auth.logout.error', undefined, 'warning');
    } finally {
      clearSentryUser();
      setIsLoggedIn(false);
      storage.remove(LOGIN_STATE_KEY);
    }
  };

  return <AuthContext.Provider value={{ isLoggedIn, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
