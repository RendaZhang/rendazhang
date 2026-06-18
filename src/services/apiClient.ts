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
  /**
   * Optional message for 401 errors. Chat streaming historically surfaces
   * `Unauthorized`, while regular JSON endpoints use the response body or
   * status fallback.
   */
  unauthorizedMessage?: string;
  /**
   * Optional per-endpoint HTTP error message override for non-OK responses.
   */
  failureMessage?: (response: Response) => string;
}

interface StreamLinesOptions extends RequestOptions {
  onLine: (line: string) => void;
}

type ApiError = Error & {
  status?: number;
  error?: string;
};

function createApiError(message: string, status?: number, errorCode?: string): ApiError {
  const error = new Error(message) as ApiError;
  if (typeof status === 'number') {
    error.status = status;
  }
  if (errorCode) {
    error.error = errorCode;
  }
  return error;
}

function normalizeApiError(error: unknown): ApiError {
  const err = (error instanceof Error ? error : new Error(String(error))) as ApiError;
  if (err.status === undefined && err.error === undefined) {
    err.error = 'network';
  }
  return err;
}

function createFetchOptions(options: RequestOptions): RequestInit {
  const { skipAuthRedirect, unauthorizedMessage, failureMessage, ...fetchOptions } = options;
  void skipAuthRedirect;
  void unauthorizedMessage;
  void failureMessage;

  const method = (fetchOptions.method || 'GET').toUpperCase();
  let headers: HeadersInit | undefined;
  if (method === 'GET') {
    if (fetchOptions.headers) {
      const hdrs = new Headers(fetchOptions.headers as HeadersInit);
      hdrs.delete('Content-Type');
      headers = Object.fromEntries(hdrs.entries());
    }
  } else {
    headers = { ...JSON_HEADERS, ...(fetchOptions.headers || {}) };
  }

  return {
    ...fetchOptions,
    headers,
    credentials: 'include'
  };
}

function handleUnauthorized(url: string, options: RequestOptions): void {
  if (typeof window === 'undefined') {
    return;
  }
  storage.remove(LOGIN_STATE_KEY);
  document.documentElement.dataset.loggedIn = 'false';
  if (url !== ENDPOINTS.AUTH.LOGIN && !options.skipAuthRedirect) {
    window.location.href = '/login';
  }
}

async function fetchWithDefaults(url: string, options: RequestOptions = {}): Promise<Response> {
  return fetch(url, createFetchOptions(options));
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
    const response = await fetchWithDefaults(url, options);

    const data = ((await response.json?.().catch(() => ({}))) ?? {}) as TResponse & {
      error?: string;
    };

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthorized(url, options);
      }
      const errorMessage =
        response.status === 401 && options.unauthorizedMessage
          ? options.unauthorizedMessage
          : (options.failureMessage?.(response) ??
            data.error ??
            `Request failed: ${response.status}`);
      const error = createApiError(errorMessage, response.status, data.error);
      // const sanitizedOptions = sanitizeOptions(options);
      // Sentry.captureException(error, {
      //   tags: { url },
      //   extra: { options: sanitizedOptions }
      // });
      throw error;
    }

    return data as TResponse;
  } catch (error) {
    const err = normalizeApiError(error);
    // const sanitizedOptions = sanitizeOptions(options);
    // Sentry.captureException(err, {
    //   tags: { url },
    //   extra: { options: sanitizedOptions }
    // });
    throw err;
  }
}

async function streamLines(url: string, options: StreamLinesOptions): Promise<void> {
  const { onLine, ...requestOptions } = options;
  try {
    const response = await fetchWithDefaults(url, requestOptions);

    if (response.status === 401) {
      handleUnauthorized(url, requestOptions);
      throw createApiError(requestOptions.unauthorizedMessage ?? 'Unauthorized', response.status);
    }

    if (!response.ok) {
      throw createApiError(
        requestOptions.failureMessage?.(response) ?? `Request failed: ${response.status}`,
        response.status
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Readable stream not supported');
    }

    const decoder = new TextDecoder();
    let pendingLine = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      pendingLine += decoder.decode(value, { stream: true });
      const lines = pendingLine.split('\n');
      pendingLine = lines.pop() ?? '';

      for (const line of lines) {
        onLine(line);
      }
    }

    pendingLine += decoder.decode();
    if (pendingLine) {
      onLine(pendingLine);
    }
  } catch (error) {
    throw normalizeApiError(error);
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
  request,
  streamLines
};

export default apiClient;
export type { RequestOptions, StreamLinesOptions };
