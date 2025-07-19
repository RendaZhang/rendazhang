// Centralized configuration for API endpoints and chat limits
export const API_BASE_URL = '/cloudchat';

export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  IMAGE_GENERATION: `${API_BASE_URL}/generate_image`
};

export const STORAGE_KEY = 'deepseek_chat_history';
export const MAX_TOKENS = 15000;
export const AVG_WORD_LENGTH = 4;
export const AVG_TOKENS_PER_WORD = 1.5;
