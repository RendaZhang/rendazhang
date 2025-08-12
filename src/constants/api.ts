import { getEnv } from '../utils/env';

const DEFAULT_BASE = '/cloudchat';
export const API_BASE_URL: string = getEnv('API_BASE_URL') || DEFAULT_BASE;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    PASSWORD_FORGOT: `${API_BASE_URL}/auth/password/forgot`,
    PASSWORD_RESET: `${API_BASE_URL}/auth/password/reset`,
    HEALTHZ: `${API_BASE_URL}/auth/healthz`
  },
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  TEST: `${API_BASE_URL}/test`
} as const;
// Note: Legacy /chat and /generate_image routes were removed; deepseek_chat remains public.

export const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json'
};
