const DEFAULT_BASE = '/cloudchat';
export const API_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_API_BASE_URL
    ? import.meta.env.PUBLIC_API_BASE_URL
    : typeof process !== 'undefined' && process.env.PUBLIC_API_BASE_URL
      ? process.env.PUBLIC_API_BASE_URL
      : DEFAULT_BASE;

export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  IMAGE_GENERATION: `${API_BASE_URL}/generate_image`
};

export const JSON_HEADERS = {
  'Content-Type': 'application/json'
};
