import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  setContext: vi.fn(),
  setTag: vi.fn(),
  setUser: vi.fn()
}));

import * as Sentry from '@sentry/react';
import type { AuthMeResponse } from '../types';
import {
  addSentryBreadcrumb,
  clearSentryUser,
  setAuthenticatedSentryUser
} from '../utils/sentryContext';

const sentryMock = Sentry as unknown as {
  addBreadcrumb: ReturnType<typeof vi.fn>;
  setContext: ReturnType<typeof vi.fn>;
  setTag: ReturnType<typeof vi.fn>;
  setUser: ReturnType<typeof vi.fn>;
};

describe('sentryContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('publishes only safe authenticated user context', () => {
    const user: AuthMeResponse['user'] = {
      id: 42,
      uid: 'user_42',
      email: 'renda@example.com',
      phone: '+15555550123',
      display_name: 'Renda Zhang',
      is_active: true
    };

    setAuthenticatedSentryUser(user);

    expect(sentryMock.setUser).toHaveBeenCalledWith({ id: '42', username: 'user_42' });
    expect(sentryMock.setTag).toHaveBeenCalledWith('auth.state', 'authenticated');
    expect(sentryMock.setTag).toHaveBeenCalledWith('auth.active', 'true');
    expect(sentryMock.setContext).toHaveBeenCalledWith('auth', {
      authenticated: true,
      is_active: true
    });

    const sentData = JSON.stringify([
      sentryMock.setUser.mock.calls,
      sentryMock.setTag.mock.calls,
      sentryMock.setContext.mock.calls
    ]);
    expect(sentData).not.toContain('renda@example.com');
    expect(sentData).not.toContain('+15555550123');
    expect(sentData).not.toContain('Renda Zhang');
  });

  it('clears user context to an anonymous auth state', () => {
    clearSentryUser();

    expect(sentryMock.setUser).toHaveBeenCalledWith(null);
    expect(sentryMock.setTag).toHaveBeenCalledWith('auth.state', 'anonymous');
    expect(sentryMock.setTag).toHaveBeenCalledWith('auth.active', 'unknown');
    expect(sentryMock.setContext).toHaveBeenCalledWith('auth', { authenticated: false });
  });

  it('removes sensitive breadcrumb data keys', () => {
    addSentryBreadcrumb(
      'contact.submit.success',
      {
        ok: true,
        status: 200,
        email: 'renda@example.com',
        phone: '+15555550123',
        message: 'private form body',
        token: 'secret-token'
      },
      'info'
    );

    expect(sentryMock.addBreadcrumb).toHaveBeenCalledWith({
      category: 'contact',
      message: 'Contact form submit succeeded',
      level: 'info',
      data: { ok: true, status: 200 }
    });
  });
});
