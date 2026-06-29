import { IMAGE_PATHS } from './paths';

export const SITE_BASE_URL = 'https://www.rendazhang.com';
export const SITE_DOMAIN = 'www.rendazhang.com';
export const PERSON_SCHEMA_ID = `${SITE_BASE_URL}/#person`;
export const WEBSITE_SCHEMA_ID = `${SITE_BASE_URL}/#website`;
export const HOME_PROFILE_PAGE_SCHEMA_ID = `${SITE_BASE_URL}/#profile-page`;
export const DOCS_PAGE_SCHEMA_ID = `${SITE_BASE_URL}/docs/#webpage`;
export const CERTIFICATIONS_PAGE_SCHEMA_ID = `${SITE_BASE_URL}/certifications/#webpage`;
export const AWS_SAA_CREDENTIAL_SCHEMA_ID = `${SITE_BASE_URL}/certifications/#aws-saa-c03`;
export const SITE_DESCRIPTION_EN =
  'Renda Zhang is a Shenzhen-based Java/Spring backend and cloud-native software engineer joining OneConnect Financial Technology as a Senior Backend Engineer / Team Lead in July 2026, focused on insurance platforms, AWS, GCP, Kubernetes, APIs, and reliable delivery.';

export const PAGE_TITLES = {
  ABOUT_ZH: '张人大 · 后端开发高级工程师 / TL',
  ABOUT_EN: 'Renda Zhang · Senior Backend Engineer / TL',
  DOCS_ZH: '技术文档 · 张人大',
  DOCS_EN: 'Technical Documentation · Renda Zhang',
  LOGIN_ZH: '登录',
  LOGIN_EN: 'Login',
  REGISTER_ZH: '注册',
  REGISTER_EN: 'Register',
  PROFILE_ZH: '账号信息',
  PROFILE_EN: 'Account Profile'
} as const;

export const LOGO_ALT = {
  EN: 'Renda Zhang Logo',
  ZH: '张人大 Logo'
} as const;

export const LOGIN_DESCRIPTION = 'The Login Page of Renda Zhang';
export const REGISTER_DESCRIPTION = 'The Register Page of Renda Zhang';
export const AI_CHAT_WIDGET_TITLE = 'AI Chat';
export const DOCS_DESCRIPTION =
  'Technical documentation for Renda Zhang, covering Astro, React, Java/Spring backend context, cloud-native delivery, CI/CD, testing, SEO/GEO, and operations notes.';
export const CERTIFICATIONS_DESCRIPTION =
  'Renda Zhang professional certification record, including AWS Certified Solutions Architect - Associate (SAA-C03), issue date, expiration date, and public verification links.';
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
export const DEFAULT_SOCIAL_IMAGE_ALT =
  'Renda Zhang software engineer profile, cloud-native skills, and certification preview';

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
  'https://www.linkedin.com/in/RendaZhang',
  'https://blog.csdn.net/qq_40286307',
  'https://rendazhang.medium.com'
] as const;
export const SITE_AUTHOR_EN = 'Renda Zhang';
export const SITE_AUTHOR_ZH = '张人大';
export const SITE_NAME_EN = SITE_AUTHOR_EN;
export const SITE_NAME_ZH = SITE_AUTHOR_ZH;

type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdValue =
  | JsonLdPrimitive
  | readonly JsonLdValue[]
  | { readonly [key: string]: JsonLdValue | undefined };
export type JsonLdObject = { readonly [key: string]: JsonLdValue | undefined };

const PERSON_REFERENCE = { '@id': PERSON_SCHEMA_ID } as const;
const WEBSITE_REFERENCE = { '@id': WEBSITE_SCHEMA_ID } as const;
const HOME_URL = `${SITE_BASE_URL}/`;
const DOCS_URL = `${SITE_BASE_URL}/docs/`;
const CERTIFICATIONS_URL = `${SITE_BASE_URL}/certifications/`;

function withoutContext(schema: JsonLdObject): JsonLdObject {
  const schemaWithoutContext: Record<string, JsonLdValue | undefined> = {};
  Object.entries(schema).forEach(([key, value]) => {
    if (key !== '@context') {
      schemaWithoutContext[key] = value;
    }
  });
  return schemaWithoutContext;
}

function buildBreadcrumbList(id: string, items: ReadonlyArray<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  } as const;
}

export function serializeStructuredData(schemas: readonly JsonLdObject[]): string {
  if (schemas.length === 1) {
    return JSON.stringify(schemas[0]);
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas.map(withoutContext)
  });
}

export const AWS_SAA_CREDENTIAL_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOccupationalCredential',
  '@id': AWS_SAA_CREDENTIAL_SCHEMA_ID,
  name: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
  credentialCategory: 'Professional Certification',
  identifier: '9860ad4d665a44d4b0c93dfbaf824ee2',
  url: 'https://www.credly.com/badges/8a7e15fc-374b-4335-a86e-e30e5255836d/public_url',
  validFor: 'P3Y',
  dateIssued: '2025-06-16',
  expires: '2028-06-16',
  recognizedBy: {
    '@type': 'Organization',
    name: 'Amazon Web Services',
    url: 'https://aws.amazon.com/'
  }
} as const;

export const PERSON_SCHEMA = {
  '@context': 'https://schema.org/',
  '@type': 'Person',
  '@id': PERSON_SCHEMA_ID,
  name: 'Renda Zhang',
  alternateName: ['张人大'],
  hasCredential: [{ '@id': AWS_SAA_CREDENTIAL_SCHEMA_ID }],
  url: SITE_BASE_URL,
  image: `${SITE_BASE_URL}${IMAGE_PATHS.LOGO_V4}`,
  jobTitle: 'Senior Backend Engineer / Team Lead',
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Senior Backend Engineer / Team Lead',
    occupationLocation: {
      '@type': 'City',
      name: GEO_PLACENAME_EN
    },
    skills:
      'Java, Spring, API design, insurance platforms, cloud-native architecture, AWS, Google Cloud Platform, Kubernetes, Terraform, observability, team leadership'
  },
  knowsAbout: [
    'Java',
    'Spring',
    'Insurance platforms',
    'Financial technology',
    'Cloud-native architecture',
    'AWS',
    'Google Cloud Platform',
    'Kubernetes',
    'Terraform',
    'API design',
    'Observability',
    'Team leadership'
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Shenzhen',
    addressRegion: 'Guangdong',
    addressCountry: 'CN'
  },
  affiliation: {
    '@type': 'Organization',
    name: 'OneConnect Financial Technology',
    description:
      'Incoming employer for a Senior Backend Engineer / Team Lead role starting July 2026.'
  },
  sameAs: SOCIAL_PROFILE_URLS,
  description: SITE_DESCRIPTION_EN
} as const;

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_SCHEMA_ID,
  url: HOME_URL,
  name: SITE_NAME_EN,
  alternateName: [SITE_NAME_ZH, 'Renda Zhang Personal Website'],
  description: SITE_DESCRIPTION_EN,
  inLanguage: ['en', 'zh-CN'],
  author: PERSON_REFERENCE,
  publisher: PERSON_REFERENCE
} as const;

export function buildHomeStructuredDataJson(): string {
  const breadcrumb = buildBreadcrumbList(`${HOME_URL}#breadcrumb`, [
    { name: SITE_NAME_EN, url: HOME_URL }
  ]);

  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': HOME_PROFILE_PAGE_SCHEMA_ID,
    url: HOME_URL,
    name: PAGE_TITLES.ABOUT_EN,
    alternateName: PAGE_TITLES.ABOUT_ZH,
    description: SITE_DESCRIPTION_EN,
    inLanguage: ['en', 'zh-CN'],
    isPartOf: WEBSITE_REFERENCE,
    about: PERSON_REFERENCE,
    mainEntity: PERSON_REFERENCE,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${SITE_BASE_URL}${IMAGE_PATHS.LOGO_V4}`,
      caption: DEFAULT_SOCIAL_IMAGE_ALT
    },
    breadcrumb: { '@id': breadcrumb['@id'] }
  } as const;

  return serializeStructuredData([
    PERSON_SCHEMA,
    AWS_SAA_CREDENTIAL_SCHEMA,
    WEBSITE_SCHEMA,
    profilePage,
    breadcrumb
  ]);
}

export function buildDocsStructuredDataJson(): string {
  const breadcrumb = buildBreadcrumbList(`${DOCS_URL}#breadcrumb`, [
    { name: SITE_NAME_EN, url: HOME_URL },
    { name: PAGE_TITLES.DOCS_EN, url: DOCS_URL }
  ]);

  const docsPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': DOCS_PAGE_SCHEMA_ID,
    url: DOCS_URL,
    name: PAGE_TITLES.DOCS_EN,
    alternateName: PAGE_TITLES.DOCS_ZH,
    description: DOCS_DESCRIPTION,
    inLanguage: ['en', 'zh-CN'],
    isPartOf: WEBSITE_REFERENCE,
    author: PERSON_REFERENCE,
    publisher: PERSON_REFERENCE,
    about: [
      'Astro and React frontend architecture',
      'Java and Spring backend portfolio context',
      'Cloud-native website operations',
      'Testing, CI/CD, SEO, GEO, and Sentry documentation'
    ],
    breadcrumb: { '@id': breadcrumb['@id'] }
  } as const;

  return serializeStructuredData([PERSON_SCHEMA, WEBSITE_SCHEMA, docsPage, breadcrumb]);
}

export function buildCertificationsStructuredDataJson(): string {
  const breadcrumb = buildBreadcrumbList(`${CERTIFICATIONS_URL}#breadcrumb`, [
    { name: SITE_NAME_EN, url: HOME_URL },
    { name: 'Professional Certifications', url: CERTIFICATIONS_URL }
  ]);

  const credentialList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${CERTIFICATIONS_URL}#credential-list`,
    name: 'Renda Zhang professional certifications',
    numberOfItems: 1,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: { '@id': AWS_SAA_CREDENTIAL_SCHEMA_ID }
      }
    ]
  } as const;

  const certificationsPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': CERTIFICATIONS_PAGE_SCHEMA_ID,
    url: CERTIFICATIONS_URL,
    name: 'Professional Certifications · Renda Zhang',
    alternateName: '专业证书 · 张人大',
    description: CERTIFICATIONS_DESCRIPTION,
    inLanguage: ['en', 'zh-CN'],
    isPartOf: WEBSITE_REFERENCE,
    author: PERSON_REFERENCE,
    publisher: PERSON_REFERENCE,
    about: PERSON_REFERENCE,
    mainEntity: { '@id': credentialList['@id'] },
    breadcrumb: { '@id': breadcrumb['@id'] }
  } as const;

  return serializeStructuredData([
    PERSON_SCHEMA,
    AWS_SAA_CREDENTIAL_SCHEMA,
    WEBSITE_SCHEMA,
    certificationsPage,
    credentialList,
    breadcrumb
  ]);
}

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
