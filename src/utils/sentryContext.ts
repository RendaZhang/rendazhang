import * as Sentry from '@sentry/react';
import type { AuthMeResponse } from '../types';

type SafeBreadcrumbValue = string | number | boolean | null;
type SafeBreadcrumbData = Record<string, SafeBreadcrumbValue | undefined>;
type BreadcrumbLevel = 'debug' | 'info' | 'warning' | 'error';

export type SentryBreadcrumbAction =
  | 'auth.session.valid'
  | 'auth.session.missing'
  | 'auth.session.error'
  | 'auth.logout.success'
  | 'auth.logout.error'
  | 'chat.send.accepted'
  | 'chat.send.first_chunk'
  | 'chat.send.complete'
  | 'chat.send.error'
  | 'chat.send.cancel'
  | 'chat.reset.success'
  | 'chat.reset.error'
  | 'contact.submit.start'
  | 'contact.submit.success'
  | 'contact.submit.failure'
  | 'contact.submit.error';

const BREADCRUMB_MESSAGES: Record<SentryBreadcrumbAction, string> = {
  'auth.session.valid': 'Authenticated session detected',
  'auth.session.missing': 'No authenticated session',
  'auth.session.error': 'Authenticated session probe failed',
  'auth.logout.success': 'User logged out',
  'auth.logout.error': 'Logout request failed',
  'chat.send.accepted': 'Chat send accepted',
  'chat.send.first_chunk': 'Chat stream produced first chunk',
  'chat.send.complete': 'Chat send completed',
  'chat.send.error': 'Chat send failed',
  'chat.send.cancel': 'Chat send cancelled',
  'chat.reset.success': 'Chat history reset',
  'chat.reset.error': 'Chat history reset failed',
  'contact.submit.start': 'Contact form submit started',
  'contact.submit.success': 'Contact form submit succeeded',
  'contact.submit.failure': 'Contact form submit returned failure',
  'contact.submit.error': 'Contact form submit failed'
};

const SENSITIVE_DATA_KEY_PATTERN =
  /(?:body|contact|content|display|email|identifier|message|name|password|phone|prompt|secret|subject|token)/i;

function getBreadcrumbCategory(action: SentryBreadcrumbAction): string {
  return action.split('.')[0] ?? 'ui';
}

function sanitizeBreadcrumbData(data?: SafeBreadcrumbData): Record<string, SafeBreadcrumbValue> {
  if (!data) {
    return {};
  }

  return Object.entries(data).reduce<Record<string, SafeBreadcrumbValue>>(
    (safeData, [key, value]) => {
      if (value === undefined || SENSITIVE_DATA_KEY_PATTERN.test(key)) {
        return safeData;
      }
      safeData[key] = value;
      return safeData;
    },
    {}
  );
}

export function setAuthenticatedSentryUser(user: AuthMeResponse['user']): void {
  Sentry.setUser({
    id: String(user.id),
    username: user.uid
  });
  Sentry.setTag('auth.state', 'authenticated');
  Sentry.setTag('auth.active', String(user.is_active));
  Sentry.setContext('auth', {
    authenticated: true,
    is_active: user.is_active
  });
}

export function clearSentryUser(): void {
  Sentry.setUser(null);
  Sentry.setTag('auth.state', 'anonymous');
  Sentry.setTag('auth.active', 'unknown');
  Sentry.setContext('auth', {
    authenticated: false
  });
}

export function addSentryBreadcrumb(
  action: SentryBreadcrumbAction,
  data?: SafeBreadcrumbData,
  level: BreadcrumbLevel = 'info'
): void {
  const safeData = sanitizeBreadcrumbData(data);
  Sentry.addBreadcrumb({
    category: getBreadcrumbCategory(action),
    message: BREADCRUMB_MESSAGES[action],
    level,
    ...(Object.keys(safeData).length ? { data: safeData } : {})
  });
}
