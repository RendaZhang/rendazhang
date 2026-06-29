import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LOGIN_STATE_KEY } from '../constants';
import { AuthProvider, useAuth } from '../components/providers/AuthProvider';
import { apiClient } from '../services';

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
  setContext: vi.fn(),
  setTag: vi.fn(),
  setUser: vi.fn()
}));

vi.mock('../services', () => ({
  apiClient: {
    auth: {
      me: vi.fn(),
      logout: vi.fn()
    }
  }
}));

function AuthStateProbe() {
  const { isLoggedIn } = useAuth();
  return <span data-testid="auth-state">{isLoggedIn ? 'logged-in' : 'logged-out'}</span>;
}

describe('AuthProvider auth probe behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.loggedIn;
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not call auth.me when no local login signal exists', async () => {
    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('logged-out');
    });

    expect(apiClient.auth.me).not.toHaveBeenCalled();
    expect(document.documentElement.dataset.loggedIn).toBe('false');
    expect(localStorage.getItem(LOGIN_STATE_KEY)).toBeNull();
  });

  it('validates an existing local login signal and keeps authenticated state', async () => {
    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(true));
    vi.mocked(apiClient.auth.me).mockResolvedValue({
      ok: true,
      user: {
        id: 7,
        uid: 'user-7',
        email: null,
        phone: null,
        display_name: 'Test User',
        is_active: true
      }
    });

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(apiClient.auth.me).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('auth-state').textContent).toBe('logged-in');
    });

    expect(document.documentElement.dataset.loggedIn).toBe('true');
    expect(JSON.parse(localStorage.getItem(LOGIN_STATE_KEY) ?? 'false')).toBe(true);
  });

  it('clears a stale local login signal when auth.me returns 401', async () => {
    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(true));
    vi.mocked(apiClient.auth.me).mockRejectedValue({ status: 401, message: 'Unauthorized' });

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(apiClient.auth.me).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('auth-state').textContent).toBe('logged-out');
    });

    expect(document.documentElement.dataset.loggedIn).toBe('false');
    expect(localStorage.getItem(LOGIN_STATE_KEY)).toBeNull();
  });
});
