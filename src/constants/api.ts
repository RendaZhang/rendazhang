import { getEnv } from '../utils/env';

const DEFAULT_BASE = '/cloudchat';
export const API_BASE_URL: string = getEnv('API_BASE_URL') || DEFAULT_BASE;

export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  IMAGE_GENERATION: `${API_BASE_URL}/generate_image`
} as const;

export const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json'
};
