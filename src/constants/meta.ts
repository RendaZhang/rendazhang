import { IMAGE_PATHS } from './paths';

export const SITE_BASE_URL = 'https://www.rendazhang.com';
export const SITE_DOMAIN = 'www.rendazhang.com';
export const SITE_DESCRIPTION_EN = 'Renda Zhang - a Software Engineer from Shenzhen China';

export const PAGE_TITLES = {
  ABOUT_ZH: '张人大 · 软件开发工程师',
  ABOUT_EN: 'Renda Zhang · Software Engineer',
  DOCS_ZH: '技术文档 · 张人大',
  DOCS_EN: 'Technical Documentation · Renda Zhang',
  LOGIN_ZH: '登录 · 张人大',
  LOGIN_EN: 'Login · Renda Zhang',
  REGISTER_ZH: '注册 · 张人大',
  REGISTER_EN: 'Register · Renda Zhang'
} as const;

export const LOGO_ALT = {
  EN: 'Renda Zhang Logo',
  ZH: '张人大 Logo'
} as const;

export const LOGIN_DESCRIPTION = 'The Login Page of Renda Zhang';
export const REGISTER_DESCRIPTION = 'The Register Page of Renda Zhang';
export const AI_CHAT_WIDGET_TITLE = 'AI Chat';
export const DOCS_DESCRIPTION = 'Renda Zhang technical documentation';
export const CERTIFICATIONS_DESCRIPTION =
  'AWS Certified Solutions Architect - Associate (SAA-C03) and future credentials of Renda Zhang.';
export const CERTIFICATIONS_IMAGE_ALT = 'Renda Zhang Certifications';
export const LOADING_TEXT = {
  ZH: '加载中...',
  EN: 'Loading...'
} as const;

export const OG_IMAGE_DIMENSIONS = {
  WIDTH: '1200',
  HEIGHT: '630'
} as const;

export const DEFAULT_SOCIAL_IMAGE = IMAGE_PATHS.CERTIFICATIONS_COVER;

export const GEO_REGION = 'CN-GD';
export const GEO_POSITION = '22.543096;114.057865';
export const GEO_ICBM = '22.543096, 114.057865';
export const GEO_PLACENAME_EN = 'Shenzhen, Guangdong, China';

export const CONTACT_FORM_ENDPOINT = 'https://formspree.io/xlepgene';
export const CONTACT_EMAIL_PRIMARY = '952402967@qq.com';
export const CONTACT_PHONE_LOCAL = '13925067232';
export const CONTACT_PHONE_INTL = '+86-13925067232';

export const TWITTER_HANDLE = '@RendaZhang';
export const SOCIAL_PROFILE_URLS = [
  'https://github.com/RendaZhang',
  'https://www.linkedin.com/in/RendaZhang'
] as const;
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
} as const;

export const SOCIAL_LINKS = {
  ZHIHU: 'https://www.zhihu.com/people/RendaZhang',
  TOUTIAO: 'https://www.toutiao.com/c/user/50248851377/###',
  CSDN: 'https://blog.csdn.net/qq_40286307',
  MEDIUM: 'https://rendazhang.medium.com'
} as const;

export const CSDN_ARTICLES = {
  JAVA_21_LOCK: 'https://blog.csdn.net/qq_40286307/article/details/148540386',
  DUAL_BOOT_TIME: 'https://blog.csdn.net/qq_40286307/article/details/83688376'
} as const;

export const MEDIUM_ARTICLES = {
  QUANT_TRADING_AI_BOT:
    'https://rendazhang.medium.com/quantitative-trading-101-building-your-ai-trading-bot-from-scratch-cb928c834fc1'
} as const;

export const REPOSITORIES = {
  JAVA_BACKEND: 'https://github.com/RendaZhang/java-backend-development'
} as const;

export const VERIFY_URLS = {
  CREDLY: 'https://www.credly.com/badges/8a7e15fc-374b-4335-a86e-e30e5255836d/public_url',
  AWS: 'https://aws.amazon.com/verification'
} as const;

export const CREDLY_HOST = 'https://www.credly.com';
export const CREDLY_BADGE_ID = '8a7e15fc-374b-4335-a86e-e30e5255836d';

export const CREDLY_EMBED_IFRAME = {
  WIDTH: '150',
  HEIGHT: '270'
} as const;
