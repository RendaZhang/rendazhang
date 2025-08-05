import { getEnv } from '../utils/env.js';

const DEFAULT_BASE = '/cloudchat';
export const API_BASE_URL = getEnv('API_BASE_URL') || DEFAULT_BASE;

export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  IMAGE_GENERATION: `${API_BASE_URL}/generate_image`
};

export const JSON_HEADERS = {
  'Content-Type': 'application/json'
};
