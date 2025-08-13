import { ENDPOINTS, JSON_HEADERS } from '../constants/api';
import { LOGIN_STATE_KEY } from '../constants';
import { storage } from '../utils';
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

/**
 * Removes sensitive or non-serializable fields from request options before
 * sending them to logging systems. This prevents leaking authentication
 * tokens or large payload bodies.
 *
 * - Strips the `Authorization` header if present.
 * - Omits the `body` property entirely.
 *
 * @param options - Original `fetch` options.
 * @returns A shallow copy of `options` with sensitive fields removed.
 */
interface RequestOptions extends RequestInit {
  /**
   * When true, bypasses the automatic redirect to the login page on 401
   * responses. This is useful for endpoints like `auth.me` that intentionally
   * probe the current authentication state and expect a 401 when the user is
   * not logged in.
   */
  skipAuthRedirect?: boolean;
}

// Helper functiion for sanitization
// function sanitizeOptions(options: RequestInit): Record<string, unknown> {
//   const sanitized: Record<string, unknown> = { ...options };

//   if (sanitized.headers) {
//     const headers = new Headers(sanitized.headers as HeadersInit);
//     headers.delete('Authorization');
//     sanitized.headers = Object.fromEntries(headers.entries());
//   }

//   if ('body' in sanitized) {
//     delete sanitized.body;
//   }

//   return sanitized;
// }

/**
 * Performs an HTTP request with common defaults and error handling.
 *
 * Behavior:
 * - Forces `credentials: 'include'` so that cookies are always sent and cannot
 *   be overridden by callers.
 * - For `GET` requests, strips the `Content-Type` header to comply with the
 *   backend authentication specification.
 * - For other methods, merges the default JSON headers with any caller-provided
 *   headers.
 * - Parses the JSON response and throws an `Error` with status information when
 *   the response is not OK.
 * - Any captured errors needed to be reported with sanitized options.
 *
 * @param url - Endpoint to request.
 * @param options - Additional `fetch` options.
 * @returns Resolves with the parsed JSON response.
 * @throws Error containing `status` and optional `error` fields when the
 * response indicates failure.
 */
async function request<TResponse>(url: string, options: RequestOptions = {}): Promise<TResponse> {
  try {
    const method = (options.method || 'GET').toUpperCase();
    // Avoid sending `Content-Type` for GET requests as per AUTH_SPECIFICATION.
    let headers: HeadersInit | undefined;
    if (method === 'GET') {
      if (options.headers) {
        const hdrs = new Headers(options.headers as HeadersInit);
        hdrs.delete('Content-Type');
        headers = Object.fromEntries(hdrs.entries());
      }
    } else {
      headers = { ...JSON_HEADERS, ...(options.headers || {}) };
    }
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
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
      // const sanitizedOptions = sanitizeOptions(options);
      // Sentry.captureException(error, {
      //   tags: { url },
      //   extra: { options: sanitizedOptions }
      // });
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          storage.remove(LOGIN_STATE_KEY);
          document.documentElement.dataset.loggedIn = 'false';
          if (url !== ENDPOINTS.AUTH.LOGIN && !options.skipAuthRedirect) {
            window.location.href = '/login';
          }
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
    // const sanitizedOptions = sanitizeOptions(options);
    // Sentry.captureException(err, {
    //   tags: { url },
    //   extra: { options: sanitizedOptions }
    // });
    throw err;
  }
}

/**
 * Typed helpers wrapping the `request` function for each backend endpoint.
 * Consumers should use these methods instead of calling `fetch` directly.
 */
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
    me: (): Promise<AuthMeResponse> =>
      request<AuthMeResponse>(ENDPOINTS.AUTH.ME, { skipAuthRedirect: true }),
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
