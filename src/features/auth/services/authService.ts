import { API_BASE_URL, JSON_HEADERS } from '../../../constants';
import { storage } from '../../../utils';
import * as Sentry from '@sentry/react';

type AuthResponse<T extends Record<string, unknown> = Record<string, never>> = {
  token: string;
  expiresAt?: string;
} & T;

const TOKEN_KEY = 'auth_token';

const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  LOGOUT: `${API_BASE_URL}/logout`
} as const;

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = (await response.json()) as AuthResponse;
    setToken(data.token);
    return data;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export async function register(
  email: string,
  username: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ email, username, password })
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    const data = (await response.json()) as AuthResponse;
    setToken(data.token);
    return data;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    Sentry.captureException(error);
  } finally {
    clearToken();
  }
}

export function getToken(): string | null {
  return storage.get<string>(TOKEN_KEY) as string | null;
}

export function setToken(token: string): void {
  storage.set(TOKEN_KEY, token);
}

export function clearToken(): void {
  storage.remove(TOKEN_KEY);
}
