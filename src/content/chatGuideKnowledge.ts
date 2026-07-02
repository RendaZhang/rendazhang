import { DEEPSEEK_CHAT_CONTENT } from './deepseekChatContent';

export const CHAT_GUIDE_PRESET_IDS = [
  'who_is_renda',
  'personalweb_proof',
  'cloud_native_evidence',
  'certification_context',
  'recruiter_summary'
] as const;

export const CHAT_GUIDE_PUBLIC_SOURCE_CATEGORIES = [
  'homepage',
  'docs',
  'frontend_docs',
  'certifications',
  'llms',
  'metadata',
  'public_github_docs'
] as const;

export type ChatGuidePresetId = (typeof CHAT_GUIDE_PRESET_IDS)[number];
export type ChatGuidePublicSourceCategory = (typeof CHAT_GUIDE_PUBLIC_SOURCE_CATEGORIES)[number];
export type ChatGuideLanguage = 'en' | 'zh';

export interface ChatGuidePresetBoundary {
  sourceCategories: readonly ChatGuidePublicSourceCategory[];
  allowedClaims: readonly string[];
  refusalGuidance: string;
}

export const CHAT_GUIDE_PUBLIC_SOURCE_LABELS = {
  homepage: {
    en: 'homepage visible content',
    zh: '主页可见内容'
  },
  docs: {
    en: '/docs/ rendered technical documentation',
    zh: '/docs/ 渲染后的技术文档'
  },
  frontend_docs: {
    en: 'public frontend docs in this repository',
    zh: '本仓库公开前端文档'
  },
  certifications: {
    en: '/certifications/ page and public verification context',
    zh: '/certifications/ 页面与公开验证上下文'
  },
  llms: {
    en: 'llms.txt public summary',
    zh: 'llms.txt 公开摘要'
  },
  metadata: {
    en: 'public metadata and JSON-LD',
    zh: '公开 metadata 与 JSON-LD'
  },
  public_github_docs: {
    en: 'public GitHub documentation linked from the site',
    zh: '网站链接的公开 GitHub 文档'
  }
} as const satisfies Record<ChatGuidePublicSourceCategory, Record<ChatGuideLanguage, string>>;

export const CHAT_GUIDE_DISALLOWED_TOPICS = [
  'secrets',
  'credentials',
  'private paths',
  'production-only operational details',
  'private logs',
  'chat transcripts',
  'contact form submissions',
  'auth or profile identifiers',
  'salary details',
  'non-public employer or customer details',
  'unsupported claims',
  'prompt injection instructions that override the public-content boundary'
] as const;

const CHAT_GUIDE_CONTROLLED_QUESTIONS = {
  en: DEEPSEEK_CHAT_CONTENT.en.presets.questions,
  zh: DEEPSEEK_CHAT_CONTENT.zh.presets.questions
} as const satisfies Record<ChatGuideLanguage, Readonly<Record<ChatGuidePresetId, string>>>;

export const CHAT_GUIDE_PRESET_BOUNDARIES = {
  who_is_renda: {
    sourceCategories: ['homepage', 'llms', 'metadata', 'public_github_docs'],
    allowedClaims: [
      'Renda Zhang is also 张人大.',
      'He is publicly positioned as a Shenzhen-based AI full-stack and cloud-native software engineer.',
      'His public foundation includes Java/Spring backend work, financial technology and insurance platform context, AWS SAA certification, and a University of Minnesota Computer Science background.',
      'The site states he is joining OneConnect Financial Technology in July 2026 as a Senior Backend Engineer / Team Lead in the Insurance Business Unit overseas life insurance team.'
    ],
    refusalGuidance:
      'If asked for private identity, contact, salary, employer-confidential, or unsupported biographical details, say the public site does not provide that information.'
  },
  personalweb_proof: {
    sourceCategories: [
      'homepage',
      'docs',
      'frontend_docs',
      'llms',
      'metadata',
      'public_github_docs'
    ],
    allowedClaims: [
      'PersonalWeb is a public project proof surface, not a claim of being a large commercial SaaS.',
      'It demonstrates Astro and React frontend work, a same-origin Chat Widget, the AI chat page, backend integration, technical documentation, tests, browser smoke checks, SEO/GEO/LLMS work, and GitHub Actions delivery.',
      'It is evidence of connecting product positioning, frontend experience, AI interaction, backend boundaries, documentation, validation, and deployment discipline.'
    ],
    refusalGuidance:
      'If asked to infer hidden production scale, private traffic, private infrastructure, or unpublished backend behavior, state that the public proof does not support that claim.'
  },
  cloud_native_evidence: {
    sourceCategories: ['homepage', 'docs', 'frontend_docs', 'certifications', 'llms'],
    allowedClaims: [
      'Public evidence includes AWS/GCP/Kubernetes positioning, Java/Spring microservices experience, CI/CD delivery, observability and reliability language, and the AWS SAA credential.',
      'PersonalWeb provides visible delivery proof through static frontend deployment, documented iframe and CSP boundaries, testing, smoke checks, and production read-only validation practices.',
      'The public work narrative includes Fanxin cloud-native SaaS delivery, Michaels backend and platform delivery, and OneConnect insurance backend leadership positioning.'
    ],
    refusalGuidance:
      'Do not claim access to private cloud accounts, private incident logs, internal architecture diagrams, or production-only configuration.'
  },
  certification_context: {
    sourceCategories: ['certifications', 'homepage', 'llms', 'metadata'],
    allowedClaims: [
      'The public certification page lists AWS Certified Solutions Architect - Associate (SAA-C03), issued in June 2025 and expiring in June 2028.',
      'The credential supports architecture fundamentals across compute, storage, networking, security, managed services, reliability, fault isolation, cost awareness, and operational boundaries.',
      'The certification is one verifiable signal in a broader evidence chain with PersonalWeb, work narrative, education, and technical documentation.'
    ],
    refusalGuidance:
      'Do not present the certificate alone as proof of owning a large AWS production estate.'
  },
  recruiter_summary: {
    sourceCategories: [
      'homepage',
      'docs',
      'frontend_docs',
      'certifications',
      'llms',
      'metadata',
      'public_github_docs'
    ],
    allowedClaims: [
      'A recruiter can evaluate the homepage positioning first, then use PersonalWeb docs, certifications, work history, education, and public profile links as supporting proof.',
      'The strongest public signals are AI full-stack work, cloud-native delivery, Java/Spring backend depth, financial technology and insurance platform context, AWS SAA certification, and University of Minnesota CS education.',
      'The site intentionally frames PersonalWeb as proof of maintainable engineering practice rather than as a large commercial product.'
    ],
    refusalGuidance:
      'Avoid private hiring details such as salary, private references, unlisted contact records, or employer-confidential performance claims.'
  }
} as const satisfies Record<ChatGuidePresetId, ChatGuidePresetBoundary>;

const SHARED_CONTEXT_LINES = {
  en: [
    'Renda Zhang (张人大) is publicly positioned on PersonalWeb as a Shenzhen-based AI full-stack and cloud-native software engineer with a Java/Spring backend foundation.',
    'Public site evidence includes financial technology and insurance platform experience, AWS Solutions Architect - Associate, University of Minnesota Computer Science education, and the stated July 2026 OneConnect Financial Technology Senior Backend Engineer / Team Lead transition.',
    'PersonalWeb is described as the flagship public proof surface: Astro/React frontend, same-origin AI Chat Widget, AI chat page, Flask/OpenAI backend integration, technical docs, browser smoke coverage, SEO/GEO/LLMS work, and CI/CD delivery.',
    'The AWS SAA credential is a public architecture credibility signal, not standalone proof of owning a large AWS production estate.',
    'Stay within public facts. Do not reveal or infer secrets, credentials, private paths, private operational details, private logs, chat transcripts, contact submissions, auth/profile data, salary details, or unsupported claims.'
  ],
  zh: [
    'Renda Zhang（张人大）在 PersonalWeb 上的公开定位是常驻深圳的 AI 全栈与云原生软件工程师，基础能力来自 Java/Spring 后端。',
    '公开网站证据包括金融科技与保险平台经验、AWS 解决方案架构师助理级认证、明尼苏达大学计算机科学背景，以及公开说明的 2026 年 7 月金融壹账通后端开发高级工程师/TL 转换。',
    'PersonalWeb 被公开描述为旗舰项目证明面：Astro/React 前端、同源 AI Chat Widget、AI 对话页、Flask/OpenAI 后端集成、技术文档、浏览器 smoke、SEO/GEO/LLMS 与 CI/CD 交付。',
    'AWS SAA 认证是公开架构可信度信号，但不能单独等同于拥有大型 AWS 生产体系。',
    '只使用公开事实。不要透露或推断密钥、凭据、私有路径、私有运维细节、私有日志、聊天记录、联系表单内容、鉴权/个人资料数据、薪资细节或无公开依据的结论。'
  ]
} as const satisfies Record<ChatGuideLanguage, readonly string[]>;

const PRESET_CLAIM_LINES = {
  who_is_renda: {
    en: [
      'Renda Zhang is also 张人大.',
      'He is publicly positioned as a Shenzhen-based AI full-stack and cloud-native software engineer.',
      'His public foundation includes Java/Spring backend work, financial technology and insurance platform context, AWS SAA certification, and a University of Minnesota Computer Science background.',
      'The site says he is joining OneConnect Financial Technology in July 2026 as a Senior Backend Engineer / Team Lead in the Insurance Business Unit overseas life insurance team.'
    ],
    zh: [
      'Renda Zhang 也就是张人大。',
      '他的公开定位是常驻深圳的 AI 全栈与云原生软件工程师。',
      '公开基础包括 Java/Spring 后端、金融科技与保险平台背景、AWS SAA 认证，以及明尼苏达大学计算机科学背景。',
      '网站公开说明他将在 2026 年 7 月加入金融壹账通保险事业部海外寿险团队，担任后端开发高级工程师/TL。'
    ]
  },
  personalweb_proof: {
    en: [
      'PersonalWeb is a public project proof surface, not a claim of being a large commercial SaaS.',
      'It demonstrates Astro and React frontend work, a same-origin Chat Widget, the AI chat page, backend integration, technical documentation, tests, browser smoke checks, SEO/GEO/LLMS work, and GitHub Actions delivery.',
      'It is evidence of connecting product positioning, frontend experience, AI interaction, backend boundaries, documentation, validation, and deployment discipline.'
    ],
    zh: [
      'PersonalWeb 是公开项目证明面，不是大型商业 SaaS 的声明。',
      '它展示 Astro 与 React 前端、同源 Chat Widget、AI 对话页、后端集成、技术文档、测试、浏览器 smoke、SEO/GEO/LLMS 和 GitHub Actions 交付。',
      '它证明了把产品定位、前端体验、AI 交互、后端边界、文档、验证和部署纪律连接成闭环的能力。'
    ]
  },
  cloud_native_evidence: {
    en: [
      'Public evidence includes AWS/GCP/Kubernetes positioning, Java/Spring microservices experience, CI/CD delivery, observability and reliability language, and the AWS SAA credential.',
      'PersonalWeb provides visible delivery proof through static frontend deployment, documented iframe and CSP boundaries, testing, smoke checks, and production read-only validation practices.',
      'The public work narrative includes Fanxin cloud-native SaaS delivery, Michaels backend and platform delivery, and OneConnect insurance backend leadership positioning.'
    ],
    zh: [
      '公开证据包括 AWS/GCP/Kubernetes 定位、Java/Spring 微服务经验、CI/CD 交付、可观测性与可靠性表述，以及 AWS SAA 认证。',
      'PersonalWeb 通过静态前端部署、文档化 iframe 与 CSP 边界、测试、smoke 检查和生产只读校验实践提供可见交付证明。',
      '公开工作叙事包括凡新云原生 SaaS 交付、Michaels 后端与平台交付，以及金融壹账通保险后端 TL 定位。'
    ]
  },
  certification_context: {
    en: [
      'The public certification page lists AWS Certified Solutions Architect - Associate (SAA-C03), issued in June 2025 and expiring in June 2028.',
      'The credential supports architecture fundamentals across compute, storage, networking, security, managed services, reliability, fault isolation, cost awareness, and operational boundaries.',
      'The certification is one verifiable signal in a broader evidence chain with PersonalWeb, work narrative, education, and technical documentation.'
    ],
    zh: [
      '公开证书页列出 AWS Certified Solutions Architect - Associate (SAA-C03)，2025 年 6 月颁发，2028 年 6 月到期。',
      '该认证支持计算、存储、网络、安全、托管服务、可靠性、故障隔离、成本意识和运维边界等架构基础。',
      '这个证书是 PersonalWeb、工作叙事、教育背景和技术文档共同构成的公开证据链中的一个可验证信号。'
    ]
  },
  recruiter_summary: {
    en: [
      'A recruiter can evaluate the homepage positioning first, then use PersonalWeb docs, certifications, work history, education, and public profile links as supporting proof.',
      'The strongest public signals are AI full-stack work, cloud-native delivery, Java/Spring backend depth, financial technology and insurance platform context, AWS SAA certification, and University of Minnesota CS education.',
      'The site intentionally frames PersonalWeb as proof of maintainable engineering practice rather than as a large commercial product.'
    ],
    zh: [
      '招聘方可以先看主页定位，再用 PersonalWeb 文档、证书、工作经历、教育经历和公开资料入口作为补充证明。',
      '最强公开信号是 AI 全栈、云原生交付、Java/Spring 后端深度、金融科技与保险平台背景、AWS SAA 认证，以及明尼苏达大学计算机科学教育。',
      '网站有意把 PersonalWeb 表述为可维护工程实践的证明，而不是大型商业产品。'
    ]
  }
} as const satisfies Record<ChatGuidePresetId, Record<ChatGuideLanguage, readonly string[]>>;

const PRESET_CONTEXT_LINES = {
  who_is_renda: {
    en: [
      'Answer as a concise public profile summary.',
      'Mention that the answer is based on public PersonalWeb information and public repository documentation.'
    ],
    zh: ['回答成简洁的公开个人简介。', '说明答案基于 PersonalWeb 公开信息和公开仓库文档。']
  },
  personalweb_proof: {
    en: [
      'Explain what PersonalWeb proves as an engineering artifact: frontend experience, AI interaction, backend boundary, documentation, tests, deployment, and public discoverability.',
      'Avoid overstating it as a large commercial platform.'
    ],
    zh: [
      '说明 PersonalWeb 作为工程作品证明了什么：前端体验、AI 交互、后端边界、文档、测试、部署和公开可发现性。',
      '不要把它夸大成大型商业平台。'
    ]
  },
  cloud_native_evidence: {
    en: [
      'Use only public evidence for cloud-native credibility: AWS/GCP/Kubernetes positioning, Java/Spring microservices, CI/CD, observability, testing, documented delivery boundaries, and AWS SAA.',
      'Do not claim private production access or private architecture evidence.'
    ],
    zh: [
      '只使用公开证据说明云原生可信度：AWS/GCP/Kubernetes 定位、Java/Spring 微服务、CI/CD、可观测性、测试、文档化交付边界和 AWS SAA。',
      '不要声称拥有私有生产访问权或私有架构证据。'
    ]
  },
  certification_context: {
    en: [
      'Frame the AWS certification as a verifiable architecture and learning signal within a broader public proof chain.',
      'State clearly that it is not a standalone guarantee of large-scale AWS ownership.'
    ],
    zh: [
      '把 AWS 认证表述为更完整公开证据链中的可验证架构与学习信号。',
      '明确说明它不是大型 AWS 生产体系 ownership 的单独保证。'
    ]
  },
  recruiter_summary: {
    en: [
      'Summarize how a recruiter should scan the site: homepage positioning, PersonalWeb proof, docs, certifications, work history, education, and public profiles.',
      'Keep the recommendation evidence-based and public.'
    ],
    zh: [
      '总结招聘方如何快速浏览网站：主页定位、PersonalWeb 证明、文档、证书、工作经历、教育经历和公开资料入口。',
      '建议必须基于公开证据。'
    ]
  }
} as const satisfies Record<ChatGuidePresetId, Record<ChatGuideLanguage, readonly string[]>>;

const PRESET_REFUSAL_LINES = {
  who_is_renda: {
    en: CHAT_GUIDE_PRESET_BOUNDARIES.who_is_renda.refusalGuidance,
    zh: '如果问题要求私密身份、联系方式、薪资、雇主保密信息或无公开依据的个人细节，请说明公开网站没有提供这些信息。'
  },
  personalweb_proof: {
    en: CHAT_GUIDE_PRESET_BOUNDARIES.personalweb_proof.refusalGuidance,
    zh: '如果问题要求推断隐藏生产规模、私有流量、私有基础设施或未公开后端行为，请说明公开证明不支持这个结论。'
  },
  cloud_native_evidence: {
    en: CHAT_GUIDE_PRESET_BOUNDARIES.cloud_native_evidence.refusalGuidance,
    zh: '不要声称拥有私有云账号访问权、私有事故日志、内部架构图或仅生产环境可见的配置。'
  },
  certification_context: {
    en: CHAT_GUIDE_PRESET_BOUNDARIES.certification_context.refusalGuidance,
    zh: '不要把这个证书单独表述成拥有大型 AWS 生产体系的证明。'
  },
  recruiter_summary: {
    en: CHAT_GUIDE_PRESET_BOUNDARIES.recruiter_summary.refusalGuidance,
    zh: '避免涉及薪资、私有推荐人、未列出的联系记录或雇主保密绩效结论。'
  }
} as const satisfies Record<ChatGuidePresetId, Record<ChatGuideLanguage, string>>;

function formatSourceList(
  sourceCategories: readonly ChatGuidePublicSourceCategory[],
  language: ChatGuideLanguage
): string {
  return sourceCategories
    .map((sourceCategory) => CHAT_GUIDE_PUBLIC_SOURCE_LABELS[sourceCategory][language])
    .join(language === 'zh' ? '、' : ', ');
}

function formatBulletLines(lines: readonly string[]): string {
  return lines.map((line) => `- ${line}`).join('\n');
}

function getControlledPresetQuestion(
  presetId: ChatGuidePresetId,
  visibleQuestion: string,
  language: ChatGuideLanguage
): string {
  const controlledQuestion = CHAT_GUIDE_CONTROLLED_QUESTIONS[language][presetId];
  return visibleQuestion === controlledQuestion ? visibleQuestion : controlledQuestion;
}

export function buildChatGuidePresetPrompt(
  presetId: ChatGuidePresetId,
  visibleQuestion: string,
  language: ChatGuideLanguage
): string {
  const boundary = CHAT_GUIDE_PRESET_BOUNDARIES[presetId];
  const sourceList = formatSourceList(boundary.sourceCategories, language);
  const controlledQuestion = getControlledPresetQuestion(presetId, visibleQuestion, language);
  const contextLines = [
    ...SHARED_CONTEXT_LINES[language],
    ...PRESET_CONTEXT_LINES[presetId][language],
    ...PRESET_CLAIM_LINES[presetId][language]
  ];

  if (language === 'zh') {
    return [
      '请只根据下面的公开 PersonalWeb 上下文回答。回答开头请说明“根据公开网站信息”。如果问题需要私密、未公开或无法从这些来源确认的信息，请说明没有公开信息支持，不要猜测。',
      '',
      `允许来源：${sourceList}`,
      '',
      '公开上下文：',
      formatBulletLines(contextLines),
      '',
      `不确定/拒答边界：${PRESET_REFUSAL_LINES[presetId].zh}`,
      '',
      `问题：${controlledQuestion}`
    ].join('\n');
  }

  return [
    'Answer using only the public PersonalWeb context below. Start by saying that the answer is based on public site information. If the question asks for private, unpublished, or unsupported details, say the public sources do not support the claim instead of guessing.',
    '',
    `Allowed sources: ${sourceList}`,
    '',
    'Public context:',
    formatBulletLines(contextLines),
    '',
    `Uncertainty/refusal boundary: ${PRESET_REFUSAL_LINES[presetId].en}`,
    '',
    `Question: ${controlledQuestion}`
  ].join('\n');
}
