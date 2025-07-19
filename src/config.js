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

export const SCRIPT_PATHS = {
  MARKED: '/js/marked.min.js',
  PURIFY: '/js/purify.min.js',
  HIGHLIGHT: '/js/highlight.min.js',
  MERMAID: '/js/mermaid.min.js',
  JQUERY: '/js/jquery.min.js',
  LAZYLOAD: '/js/jinxin.lazyload.min.js',
  DOCS: '/js/docs.min.js',
  CREDLY_EMBED: '/js/credly_embed.min.js',
  CERTIFICATIONS: '/js/certifications.min.js'
};

export const STYLE_PATHS = {
  CHAT_WIDGET: '/css/chat_widget.css',
  BOOTSTRAP: '/css/bootstrap.min.css',
  GITHUB: '/css/github.min.css',
  DOCS: '/css/docs.min.css',
  INDEX: '/css/index.min.css',
  CERTIFICATIONS: '/css/certifications.min.css'
};

export const FAVICON_PATH = '/favicon.png';

export const IMAGE_PATHS = {
  LOADER: '/images/ajax-loader.gif',
  LOGO_EN: '/images/logo_en.png',
  LOGO_ZH: '/images/logo_cn.png',
  WECHAT_QR: '/images/qrcode_wechat.jpg'
};

export const OG_IMAGE_DIMENSIONS = {
  WIDTH: '1200',
  HEIGHT: '630'
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

// Social media and author info
export const TWITTER_HANDLE = '@RendaZhang';
export const SOCIAL_PROFILE_URLS = [
  'https://github.com/RendaZhang',
  'https://www.linkedin.com/in/RendaZhang'
];
export const SITE_AUTHOR_EN = 'Renda Zhang';
export const SITE_AUTHOR_ZH = '张人大';

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
  image: `${SITE_BASE_URL}/images/logo_en.png`,
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Self-Employed'
  },
  sameAs: SOCIAL_PROFILE_URLS,
  description: 'Renda Zhang - a Software Engineer from Shenzhen China'
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
  WIDTH: 150,
  HEIGHT: 270
};
