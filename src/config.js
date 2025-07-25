// Centralized configuration for API endpoints and chat limits
export const API_BASE_URL = '/cloudchat';
export const SITE_BASE_URL = 'https://www.rendazhang.com';
export const SITE_DOMAIN = 'www.rendazhang.com';
export const SITE_DESCRIPTION_EN = 'Renda Zhang - a Software Engineer from Shenzhen China';
export const SITE_DESCRIPTION_ZH = '来自 深圳 的 软件开发工程师 张人大';

export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/deepseek_chat`,
  RESET: `${API_BASE_URL}/reset_chat`,
  IMAGE_GENERATION: `${API_BASE_URL}/generate_image`
};

// Path for embedding or linking to the chat page
export const CHAT_PAGE_PATH = '/deepseek_chat';

// Additional site page paths
export const ABOUT_EN_PAGE_PATH = '/about.en';
export const ABOUT_ZH_PAGE_PATH = '/about.zh';
export const CERTIFICATIONS_PAGE_PATH = '/certifications';
export const DOCS_PAGE_PATH = '/docs';

// Home page path
export const HOME_PAGE_PATH = '/';

// Standard viewport meta tag values
export const VIEWPORT_ZOOM_ALLOWED =
  'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
export const VIEWPORT_NO_ZOOM = 'width=device-width, initial-scale=1.0';

// Commonly used logo image size
export const LOGO_IMAGE_SIZE = '150px';

// Commonly used page titles
export const PAGE_TITLES = {
  ABOUT_ZH: '张人大 · 软件开发工程师',
  ABOUT_EN: 'Renda Zhang · Software Engineer',
  ABOUT_EN_OG: 'Renda Zhang · Software Engineer',
  INDEX_OG: 'Renda Zhang · Personal Website'
};

// Alt text for logo images
export const LOGO_ALT = {
  EN: 'Renda Zhang Logo',
  ZH: '张人大 Logo'
};
// Reusable titles and descriptions
export const AI_CHAT_TITLE = 'AI Chat';
export const AI_CHAT_DESCRIPTION = 'Chat with an AI assistant powered by DeepSeek.';

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

export const ICON_SIZES = {
  DEFAULT: 24,
  LARGE: 28
};

export const CHAT_TEXT = {
  ENHANCEMENT_FAILED: '优化功能加载失败，基础功能不受影响',
  CORE_LOAD_FAILED: '核心资源加载失败，请刷新重试',
  CHAT_READY: '会话已就绪，请输入消息开始对话',
  LOADING: '加载对话中...',
  ENHANCEMENT_PROGRESS: '正在优化阅读体验...',
  INPUT_PLACEHOLDER_LOADING: '加载对话中，请稍候...',
  INPUT_PLACEHOLDER_ERROR: '核心资源加载失败',
  INPUT_PLACEHOLDER_DEFAULT: '输入消息...',
  RESET_CONFIRM: '确定要重置会话吗？这将清除所有对话历史。',
  RESET_FAILED_PREFIX: '重置会话失败',
  RESET_CONFIRM_EN: 'Are you sure you want to reset the conversation?',
  RESET_FAILED_PREFIX_EN: 'Reset failed',
  MESSAGE_TOO_LONG: 'Your message is too long. Please shorten it.',
  REQUEST_ERROR: 'An error occurred while processing your request.',
  COPY_LABEL: '复制',
  COPIED_LABEL: '已复制',
  SEND_BUTTON: '发送',
  RESET_BUTTON: '重置会话'
};

export const NAV_TEXT = {
  BACK: '← Back',
  BACK_HOME: '← Back to Home'
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
  JQUERY_EASING: '/js/jquery.easing.min.js',
  INDEX: '/js/index.min.js',
  CERTIFICATIONS: '/js/certifications.min.js'
};

export const STYLE_PATHS = {
  CHAT_WIDGET: '/css/chat_widget.css',
  BOOTSTRAP: '/css/bootstrap.min.css',
  BOOTSTRAP_EN: '/css/bootstrap-en.min.css',
  THEME: '/css/theme.css',
  GITHUB: '/css/github.min.css',
  DOCS: '/css/docs.min.css',
  INDEX: '/css/index.min.css',
  DEEPSEEK_CHAT: '/css/deepseek_chat.min.css',
  GITHUB_LIGHT: '/css/github-markdown-light.min.css',
  CERTIFICATIONS: '/css/certifications.min.css',
  ALL: '/css/all.min.css',
  SIMPLE_ICONS: '/css/simple-line-icons.min.css',
  SLICK: '/css/slick.min.css',
  MCUSTOM_SCROLLBAR: '/css/jquery.mCustomScrollbar.min.css',
  STYLE: '/css/style.min.css',
  ANIMATE: '/css/animate.min.css',
  MAGNIFIC_POPUP: '/css/magnific-popup.min.css',
  PE_ICON: '/css/pe-icon-7.min.css',
  FONTAWESOME: '/css/fontawesome.min.css',
  STYLE_EN: '/css/style-en.min.css',
  COLORS_DEFAULT: '/css/colors/default.css',
  OSWALD: '/css/oswald.min.css'
};

export const ABOUT_ZH_STYLES = [
  STYLE_PATHS.ALL,
  STYLE_PATHS.SIMPLE_ICONS,
  STYLE_PATHS.SLICK,
  STYLE_PATHS.MCUSTOM_SCROLLBAR,
  STYLE_PATHS.STYLE
];

export const ABOUT_ZH_SCRIPTS = [
  '/js/popper.min.js',
  '/js/bootstrap.min.js',
  '/js/jquery.waypoints.min.js',
  '/js/jquery.counterup.min.js',
  '/js/jquery.mCustomScrollbar.concat.min.js',
  '/js/isotope.pkgd.min.js',
  '/js/infinite-scroll.min.js',
  '/js/imagesloaded.pkgd.min.js',
  '/js/slick.min.js',
  '/js/validator.min.js',
  '/js/contact.js',
  '/js/custom.min.js'
];

export const ABOUT_EN_STYLES = [
  STYLE_PATHS.BOOTSTRAP_EN,
  STYLE_PATHS.ANIMATE,
  STYLE_PATHS.MAGNIFIC_POPUP,
  STYLE_PATHS.PE_ICON,
  STYLE_PATHS.FONTAWESOME,
  STYLE_PATHS.STYLE_EN,
  STYLE_PATHS.COLORS_DEFAULT,
  STYLE_PATHS.OSWALD
];

export const ABOUT_EN_SCRIPTS = [
  '/js/bootstrap.bundle.min.js',
  '/js/scrollspy.min.js',
  '/js/floating-menu.min.js',
  '/js/jquery.magnific-popup.min.js',
  '/js/isotope.min.js',
  '/js/masonry.pkgd.min.js',
  '/js/jquery.textillate.min.js',
  '/js/jquery.lettering.min.js',
  '/js/portfolio-filtr.min.js',
  '/js/contact-form.min.js',
  '/js/switcher.min.js',
  '/js/app.min.js'
];

export const FAVICON_PATH = '/favicon.png';

export const IMAGE_PATHS = {
  LOADER: '/images/ajax-loader.gif',
  LOGO_EN: '/images/logo_en.png',
  LOGO_ZH: '/images/logo_cn.png',
  WECHAT_QR: '/images/qrcode_wechat.jpg',
  HERO: '/images/hero.jpg',
  CERTIFICATIONS_COVER: '/images/certifications_cover.jpg',
  RESUME_EN: '/images/Resume_RendaZhang.pdf',
  RESUME_ZH: '/images/个人简历_张人大.pdf'
};

export const RESUME_EN_DOWNLOAD = 'Resume_RendaZhang_20250622.pdf';
export const RESUME_ZH_DOWNLOAD = '个人简历_张人大_20250622.pdf';

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
  image: `${SITE_BASE_URL}/images/logo_en.png`,
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

export const CREDLY_CONTAINER_MAX_WIDTH = '270';
export const SCROLL_OFFSET = 120;
