import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  type ReactElement
} from 'react';
import { apiClient } from '../../services';
import { storage, logger } from '../../utils';
import { LOGIN_STATE_KEY } from '../../constants';
import * as Sentry from '@sentry/react';

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
    return Boolean(storage.get(LOGIN_STATE_KEY));
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.loggedIn = isLoggedIn ? 'true' : 'false';
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const init = async () => {
      try {
        await apiClient.auth.me();
        setIsLoggedIn(true);
        storage.set(LOGIN_STATE_KEY, true);
      } catch (e) {
        const status = (e as { status?: number }).status;
        if (status !== 401) {
          logger.error('AuthProvider init failed', e);
          Sentry.captureException(e);
        }
        setIsLoggedIn(false);
        storage.remove(LOGIN_STATE_KEY);
      }
    };
    init();
  }, []);

  const logout = async (): Promise<void> => {
    try {
      await apiClient.auth.logout();
    } catch (e) {
      logger.error('AuthProvider logout failed', e);
      Sentry.captureException(e);
    } finally {
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
