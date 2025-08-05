import { API_BASE_URL, ENDPOINTS } from './api.js';

export const VIEWPORT_ZOOM_ALLOWED =
  'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
export const VIEWPORT_NO_ZOOM = 'width=device-width, initial-scale=1.0';

export const STORAGE_KEY = 'deepseek_chat_history';
export const THEME_STORAGE_KEY = 'preferred_theme';
export const LANG_STORAGE_KEY = 'preferred_lang';
export const REGISTER_DRAFT_KEY = 'register_draft';

export const MAX_TOKENS = 15000;
export const AVG_WORD_LENGTH = 4;
export const AVG_TOKENS_PER_WORD = 1.5;

export const ROLES = {
  USER: 'user',
  AI: 'ai',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
};

export const SCRIPT_TIMEOUTS = {
  DEFAULT: 10000,
  HIGHLIGHT: 30000,
  MERMAID: 60000
};

export const UI_DURATIONS = {
  HINT: 2000,
  FADE: 300,
  COPY_FEEDBACK: 1000,
  ERROR_HIDE_DELAY: 2000
};

export const ICON_SIZES = {
  DEFAULT: 24,
  LARGE: 28
};

export const AUTH_TIMINGS = {
  LOGIN_REQUEST: 1000,
  LOGIN_REDIRECT: 3000,
  REGISTER_VALIDATE: 500,
  REGISTER_PROGRESS_INTERVAL: 500,
  REGISTER_PROGRESS_TOTAL: 1600,
  REGISTER_REDIRECT: 5000,
  REGISTER_PROGRESS_STEP: 33
};

export const LEGACY_CHAT_ENDPOINT = `${API_BASE_URL}/chat`;
export const TYPING_INTERVAL = 30;

export const GLOBAL_CONFIG = {
  API_BASE_URL,
  ENDPOINTS,
  LEGACY_CHAT_ENDPOINT,
  TYPING_INTERVAL
};

if (typeof window !== 'undefined') {
  window.config = GLOBAL_CONFIG;
}
