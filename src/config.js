// Centralized configuration for API endpoints and chat limits
import wechatQr from './assets/qrcode-wechat-medium-square-258x258.jpg?url';
import wechatLogo from './assets/social/wechat-logo.svg';
import zhihuLogo from './assets/social/zhihu-logo.svg';
import toutiaoLogo from './assets/social/toutiao-logo.svg';
import csdnLogo from './assets/social/csdn-logo.svg';
import mediumLogo from './assets/social/medium-logo.svg';
import heroImgUrl from './assets/hero-default-low-rectangle-900x600.jpg?url';
import coverCertificationsUrl from './assets/cover-certifications-high-rectangle-1200x630.jpg?url';
import resumeEnUrl from './assets/Resume_RendaZhang.pdf?url';
import resumeZhUrl from './assets/个人简历_张人大.pdf?url';
import logoV4Url from './assets/logo-v4-high-circle-300x300.png?url';
import faviconPngUrl from './assets/favicons/favicon.png?url';
import faviconIcoUrl from './assets/favicons/favicon.ico?url';
import favicon16Url from './assets/favicons/favicon-16x16.png?url';
import chatWidgetCssUrl from './styles/chat_widget.css?url';
import docsCssUrl from './styles/docs.css?url';
import deepseekChatCssUrl from './styles/deepseek_chat.css?url';
import certificationsCssUrl from './styles/certifications.css?url';
import githubCssUrl from './styles/github.min.css?url';
import githubLightCssUrl from './styles/github-markdown-light.min.css?url';
import githubDarkCssUrl from './styles/github-dark.css?url';
import markedUrl from './scripts/marked.min.js?url';
import purifyUrl from './scripts/purify.min.js?url';
import highlightUrl from './scripts/highlight.min.js?url';
import mermaidUrl from './scripts/mermaid.min.js?url';
export const API_BASE_URL = '/cloudchat';
export const SITE_BASE_URL = 'https://www.rendazhang.com';
export const SITE_DOMAIN = 'www.rendazhang.com';
export const SITE_DESCRIPTION_EN = 'Renda Zhang - a Software Engineer from Shenzhen China';

export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  IMAGE_GENERATION: `${API_BASE_URL}/generate_image`
};

export const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

// Path for embedding or linking to the chat page
export const CHAT_PAGE_PATH = '/deepseek_chat';

// Additional site page paths
export const ABOUT_PAGE_PATH = '/';
export const CERTIFICATIONS_PAGE_PATH = '/certifications';
export const DOCS_PAGE_PATH = '/docs';
export const LOGIN_PAGE_PATH = '/login';
export const REGISTER_PAGE_PATH = '/register';

// Paths to the documentation markdown files
export const DOC_PATHS = {
  README_ZH: '/README.md',
  README_EN: '/README_EN.md'
};

// Home page path
export const HOME_PAGE_PATH = '/';

// Standard viewport meta tag values
export const VIEWPORT_ZOOM_ALLOWED =
  'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
export const VIEWPORT_NO_ZOOM = 'width=device-width, initial-scale=1.0';

// Commonly used logo image size

// Commonly used page titles
export const PAGE_TITLES = {
  ABOUT_ZH: '张人大 · 软件开发工程师',
  ABOUT_EN: 'Renda Zhang · Software Engineer',
  DOCS_ZH: '技术文档 · 张人大',
  DOCS_EN: 'Technical Documentation · Renda Zhang',
  LOGIN_ZH: '登录 · 张人大',
  LOGIN_EN: 'Login · Renda Zhang',
  REGISTER_ZH: '注册 · 张人大',
  REGISTER_EN: 'Register · Renda Zhang'
};

// Alt text for logo images
export const LOGO_ALT = {
  EN: 'Renda Zhang Logo',
  ZH: '张人大 Logo'
};
// Reusable titles and descriptions
export const LOGIN_DESCRIPTION = 'The Login Page of Renda Zhang';
export const REGISTER_DESCRIPTION = 'The Register Page of Renda Zhang';
export const AI_CHAT_WIDGET_TITLE = 'AI Chat';
export const DOCS_DESCRIPTION = 'Renda Zhang technical documentation';
export const CERTIFICATIONS_DESCRIPTION =
  'AWS Certified Solutions Architect - Associate (SAA-C03) and future credentials of Renda Zhang.';
export const CERTIFICATIONS_IMAGE_ALT = 'Renda Zhang Certifications';
export const LOADING_TEXT = 'Loading...';

export const STORAGE_KEY = 'deepseek_chat_history';
export const THEME_STORAGE_KEY = 'preferred_theme';
export const LANG_STORAGE_KEY = 'preferred_lang';
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

// Timeouts and delays used across authentication forms
export const AUTH_TIMINGS = {
  LOGIN_REQUEST: 1000,
  LOGIN_REDIRECT: 3000,
  REGISTER_VALIDATE: 500,
  REGISTER_PROGRESS_INTERVAL: 500,
  REGISTER_PROGRESS_TOTAL: 1600,
  REGISTER_REDIRECT: 5000,
  REGISTER_PROGRESS_STEP: 33
};

// Local storage keys
export const REGISTER_DRAFT_KEY = 'register_draft';

export const SCRIPT_PATHS = {
  MARKED: markedUrl,
  PURIFY: purifyUrl,
  HIGHLIGHT: highlightUrl,
  MERMAID: mermaidUrl
};

export const STYLE_PATHS = {
  CHAT_WIDGET: chatWidgetCssUrl,
  GITHUB: githubCssUrl,
  DOCS: docsCssUrl,
  DEEPSEEK_CHAT: deepseekChatCssUrl,
  GITHUB_DARK: githubDarkCssUrl,
  GITHUB_LIGHT: githubLightCssUrl,
  CERTIFICATIONS: certificationsCssUrl
};

export const FAVICON_PATHS = {
  ICO: faviconIcoUrl,
  PNG: faviconPngUrl,
  SMALL: favicon16Url
};

export const FAVICON_PATH = FAVICON_PATHS.PNG;

export const IMAGE_PATHS = {
  WECHAT_QR: wechatQr,
  HERO: heroImgUrl,
  CERTIFICATIONS_COVER: coverCertificationsUrl,
  RESUME_EN: resumeEnUrl,
  RESUME_ZH: resumeZhUrl,
  LOGO_V4: logoV4Url
};

// Social icon paths used on the homepage
export const SOCIAL_ICON_PATHS = {
  WECHAT: wechatLogo,
  ZHIHU: zhihuLogo,
  TOUTIAO: toutiaoLogo,
  CSDN: csdnLogo,
  MEDIUM: mediumLogo
};

export const RESUME_EN_DOWNLOAD = 'Resume_RendaZhang_20250622.pdf';
export const RESUME_ZH_DOWNLOAD = '个人简历_张人大_20250622.pdf';

export const OG_IMAGE_DIMENSIONS = {
  WIDTH: '1200',
  HEIGHT: '630'
};

export const DEFAULT_SOCIAL_IMAGE = IMAGE_PATHS.CERTIFICATIONS_COVER;

// Shared site metadata
export const GEO_REGION = 'CN-GD';
export const GEO_POSITION = '22.543096;114.057865';
export const GEO_ICBM = '22.543096, 114.057865';
export const GEO_PLACENAME_EN = 'Shenzhen, Guangdong, China';

// Contact information
export const CONTACT_FORM_ENDPOINT = 'https://formspree.io/xlepgene';
export const CONTACT_EMAIL_PRIMARY = '952402967@qq.com';
export const CONTACT_PHONE_LOCAL = '13925067232';
export const CONTACT_PHONE_INTL = '+86-13925067232';

// Social media and author info
export const TWITTER_HANDLE = '@RendaZhang';
export const SOCIAL_PROFILE_URLS = [
  'https://github.com/RendaZhang',
  'https://www.linkedin.com/in/RendaZhang'
];
export const SITE_AUTHOR_EN = 'Renda Zhang';
export const SITE_AUTHOR_ZH = '张人大';
export const SITE_NAME_EN = SITE_AUTHOR_EN;
export const SITE_NAME_ZH = SITE_AUTHOR_ZH;

export const PERSON_SCHEMA = {
  '@context': 'https://schema.org/',
  '@type': 'Person',
  name: 'Renda Zhang',
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
      credentialCategory: 'Professional Certification',
      identifier: '9860ad4d665a44d4b0c93dfbaf824ee2',
      url: 'https://www.credly.com/badges/8a7e15fc-374b-4335-a86e-e30e5255836d/public_url',
      validFor: 'P3Y' /* 3 years */,
      dateIssued: '2025-06-16',
      expires: '2028-06-16'
    }
  ],
  url: SITE_BASE_URL,
  image: `${SITE_BASE_URL}${IMAGE_PATHS.LOGO_V4}`,
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Self-Employed'
  },
  sameAs: SOCIAL_PROFILE_URLS,
  description: SITE_DESCRIPTION_EN
};

// Additional social profile links
export const SOCIAL_LINKS = {
  ZHIHU: 'https://www.zhihu.com/people/RendaZhang',
  TOUTIAO: 'https://www.toutiao.com/c/user/50248851377/###',
  CSDN: 'https://blog.csdn.net/qq_40286307',
  MEDIUM: 'https://rendazhang.medium.com'
};

// Frequently referenced blog article URLs
export const CSDN_ARTICLES = {
  JAVA_21_LOCK: 'https://blog.csdn.net/qq_40286307/article/details/148540386',
  DUAL_BOOT_TIME: 'https://blog.csdn.net/qq_40286307/article/details/83688376'
};

// Frequently referenced Medium article URLs
export const MEDIUM_ARTICLES = {
  QUANT_TRADING_AI_BOT:
    'https://rendazhang.medium.com/quantitative-trading-101-building-your-ai-trading-bot-from-scratch-cb928c834fc1'
};

// Repository links
export const REPOSITORIES = {
  JAVA_BACKEND: 'https://github.com/RendaZhang/java-backend-development'
};

// Credential verification links and settings
export const VERIFY_URLS = {
  CREDLY: 'https://www.credly.com/badges/8a7e15fc-374b-4335-a86e-e30e5255836d/public_url',
  AWS: 'https://aws.amazon.com/verification'
};

export const CREDLY_HOST = 'https://www.credly.com';
export const CREDLY_BADGE_ID = '8a7e15fc-374b-4335-a86e-e30e5255836d';

export const CREDLY_EMBED_IFRAME = {
  WIDTH: '150',
  HEIGHT: '270'
};

// Legacy standalone scripts expect these globals
export const LEGACY_CHAT_ENDPOINT = `${API_BASE_URL}/chat`;
export const TYPING_INTERVAL = 30;

// Expose minimal config for non-module scripts
export const GLOBAL_CONFIG = {
  API_BASE_URL,
  ENDPOINTS,
  LEGACY_CHAT_ENDPOINT,
  TYPING_INTERVAL
};

if (typeof window !== 'undefined') {
  window.config = GLOBAL_CONFIG;
}
