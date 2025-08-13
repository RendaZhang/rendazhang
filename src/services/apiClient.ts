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

  if (sanitized.headers) {
    const headers = new Headers(sanitized.headers as HeadersInit);
    headers.delete('Authorization');
    sanitized.headers = Object.fromEntries(headers.entries());
  }

  if ('body' in sanitized) {
    delete sanitized.body;
  }

  return sanitized;
}

async function request<TResponse>(url: string, options: RequestInit = {}): Promise<TResponse> {
  try {
    const method = (options.method || 'GET').toUpperCase();
    // Avoid sending `Content-Type` for GET requests as per AUTH_SPECIFICATION.
    const headers =
      method === 'GET' ? options.headers : { ...JSON_HEADERS, ...(options.headers || {}) };
    const response = await fetch(url, {
      headers,
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
      const sanitizedOptions = sanitizeOptions(options);
      Sentry.captureException(error, {
        tags: { url },
        extra: { options: sanitizedOptions }
      });
      if (response.status === 401 && url !== ENDPOINTS.AUTH.LOGIN) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
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
    const sanitizedOptions = sanitizeOptions(options);
    Sentry.captureException(err, {
      tags: { url },
      extra: { options: sanitizedOptions }
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
