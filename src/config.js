// Centralized configuration for API endpoints and chat limits
export const API_BASE_URL = '/cloudchat';
export const SITE_BASE_URL = 'https://www.rendazhang.com';

export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  IMAGE_GENERATION: `${API_BASE_URL}/generate_image`
};

// Path for embedding or linking to the chat page
export const CHAT_PAGE_PATH = '/deepseek_chat';

export const STORAGE_KEY = 'deepseek_chat_history';
export const MAX_TOKENS = 15000;
export const MAX_CHARACTERS = 800;
export const AVG_WORD_LENGTH = 4;
export const AVG_TOKENS_PER_WORD = 1.5;

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

export const SCRIPT_PATHS = {
  MARKED: '/js/marked.min.js',
  PURIFY: '/js/purify.min.js',
  HIGHLIGHT: '/js/highlight.min.js',
  MERMAID: '/js/mermaid.min.js'
};

export const STYLE_PATHS = {
  CHAT_WIDGET: '/css/chat_widget.css'
};

export const OG_IMAGE_DIMENSIONS = {
  WIDTH: 1200,
  HEIGHT: 630
};

export const DEFAULT_SOCIAL_IMAGE = '/images/social_default.jpg';

// Shared site metadata
export const GEO_REGION = 'CN-GD';
export const GEO_POSITION = '22.543096;114.057865';
export const GEO_ICBM = '22.543096, 114.057865';
export const GEO_PLACENAME_EN = 'Shenzhen, Guangdong, China';
export const GEO_PLACENAME_ZH = '深圳, 广东, 中国';

// Contact information
export const CONTACT_FORM_ENDPOINT = 'https://formspree.io/xlepgene';
export const CONTACT_EMAIL_PRIMARY = '952402967@qq.com';
export const CONTACT_EMAIL_SECONDARY = 'dl952402967@hotmail.com';
export const CONTACT_PHONE_LOCAL = '13925067232';
export const CONTACT_PHONE_INTL = '+86-13925067232';
