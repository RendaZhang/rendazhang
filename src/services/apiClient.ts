import { ENDPOINTS, JSON_HEADERS } from '../constants/api';
import * as Sentry from '@sentry/react';
import type {
  ChatSendMessageRequest,
  ChatSendMessageResponse,
  ResetChatRequest,
  ResetChatResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthLogoutRequest,
  AuthLogoutResponse,
  AuthMeResponse,
  AuthPasswordForgotRequest,
  AuthPasswordForgotResponse,
  AuthPasswordResetRequest,
  AuthPasswordResetResponse,
  AuthHealthzResponse
} from '../types';

function sanitizeOptions(options: RequestInit): Record<string, unknown> {
  const sanitized: Record<string, unknown> = { ...options };
  if (typeof sanitized.body === 'string') {
    try {
      const body = JSON.parse(sanitized.body);
      ['password', 'token', 'identifier'].forEach((key) => {
        if (key in body) {
          body[key] = '[REDACTED]';
        }
      });
      sanitized.body = body;
    } catch {
      sanitized.body = '[REDACTED]';
    }
  }
  return sanitized;
}

async function request<TResponse>(url: string, options: RequestInit = {}): Promise<TResponse> {
  try {
    const response = await fetch(url, {
      headers: { ...JSON_HEADERS, ...(options.headers || {}) },
      credentials: 'include',
      ...options
    });

    const data = (await response.json().catch(() => ({}))) as TResponse & { error?: string };

    if (!response.ok) {
      const errorMessage = data.error ?? `Request failed: ${response.status}`;
      const error = new Error(errorMessage) as Error & {
        status?: number;
        error?: string;
      };
      error.status = response.status;
      if (data.error) error.error = data.error;
      const safeOptions = sanitizeOptions(options);
      Sentry.captureException(error, {
        tags: { url },
        extra: { options: safeOptions }
      });
      throw error;
    }

    return data as TResponse;
  } catch (error) {
    const err = (error instanceof Error ? error : new Error(String(error))) as Error & {
      status?: number;
      error?: string;
    };
    if (err.status === undefined && err.error === undefined) {
      err.error = 'network';
    }
    const safeOptions = sanitizeOptions(options);
    Sentry.captureException(err, {
      tags: { url },
      extra: { options: safeOptions }
    });
    throw err;
  }
}

const apiClient = {
  chat: {
    sendMessage: (payload: ChatSendMessageRequest): Promise<ChatSendMessageResponse> =>
      request<ChatSendMessageResponse>(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      }),
    reset: (payload: ResetChatRequest = {}): Promise<ResetChatResponse> =>
      request<ResetChatResponse>(ENDPOINTS.RESET, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      })
  },
  auth: {
    register: (payload: AuthRegisterRequest): Promise<AuthRegisterResponse> =>
      request<AuthRegisterResponse>(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      }),
    login: (payload: AuthLoginRequest): Promise<AuthLoginResponse> =>
      request<AuthLoginResponse>(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      }),
    logout: (payload: AuthLogoutRequest = {}): Promise<AuthLogoutResponse> =>
      request<AuthLogoutResponse>(ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      }),
    me: (): Promise<AuthMeResponse> => request<AuthMeResponse>(ENDPOINTS.AUTH.ME),
    passwordForgot: (payload: AuthPasswordForgotRequest): Promise<AuthPasswordForgotResponse> =>
      request<AuthPasswordForgotResponse>(ENDPOINTS.AUTH.PASSWORD_FORGOT, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      }),
    passwordReset: (payload: AuthPasswordResetRequest): Promise<AuthPasswordResetResponse> =>
      request<AuthPasswordResetResponse>(ENDPOINTS.AUTH.PASSWORD_RESET, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      }),
    healthz: (): Promise<AuthHealthzResponse> =>
      request<AuthHealthzResponse>(ENDPOINTS.AUTH.HEALTHZ)
  },
  request
};

export default apiClient;
