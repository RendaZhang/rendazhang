import { CERTIFICATIONS_PAGE_PATH, CHAT_PAGE_PATH } from '../constants';

export const DOCS_CASE_STUDY_CONTENT = {
  en: {
    eyebrow: 'PersonalWeb',
    title: 'How I built PersonalWeb',
    conclusion:
      'I maintain PersonalWeb as both my bilingual portfolio and a working engineering project. Astro serves the public pages, React handles focused interactions, Flask powers Chat, and Nginx keeps the site and API on one origin. The repository also shows how I test, deploy, and document each part.',
    storyHeading: 'Inside the project',
    story: [
      {
        title: 'Static pages with focused interactivity',
        body: 'Astro renders the main pages as static HTML. React is reserved for navigation, theme and language controls, forms, certification details, and Chat, so public content remains readable before hydration.'
      },
      {
        title: 'Chat with a clear boundary',
        body: 'The direct Chat page and floating widget share the same-origin route. Guided questions use public information from this site and its repositories, while the iframe-ready protocol stays separate from model requests.'
      },
      {
        title: 'Repeatable checks and delivery',
        body: 'Vitest, Playwright browser checks, Astro builds, GitHub Actions, and documented Nginx and CSP constraints make changes inspectable and repeatable.'
      }
    ],
    evidenceHeading: 'Inspect the implementation',
    evidence: [
      {
        label: 'Read the reference architecture',
        href: '#en-reference-architecture',
        note: 'See the frontend, backend, Nginx, and deployment boundaries.'
      },
      {
        label: 'Review CI/CD and validation',
        href: '#en-cicd-workflow',
        note: 'See how the site is built, tested, and released.'
      },
      {
        label: 'Verify my AWS certification',
        href: CERTIFICATIONS_PAGE_PATH,
        note: 'Open the credential dates, badge, and verification links.'
      },
      {
        label: 'Ask about PersonalWeb',
        href: CHAT_PAGE_PATH,
        note: 'Use guided questions backed by public site and repository information.'
      }
    ],
    boundaryHeading: 'What this project does not show',
    boundary:
      'PersonalWeb is a maintained personal project. It does not demonstrate high-traffic scale, private customer systems, or a large commercial SaaS, and its public documentation leaves out secrets, visitor messages, private logs, and server details.',
    nextActions: [
      {
        label: 'Read the technical documentation',
        href: '#en-tech-stack',
        variant: 'primary'
      },
      {
        label: 'Verify my AWS certification',
        href: CERTIFICATIONS_PAGE_PATH,
        variant: 'secondary'
      },
      {
        label: 'Contact me',
        href: '/#contact',
        variant: 'secondary'
      }
    ]
  },
  zh: {
    eyebrow: 'PersonalWeb',
    title: '我如何构建 PersonalWeb',
    conclusion:
      '我同时把 PersonalWeb 当作中英双语作品集和一个持续维护的工程项目。公开页面由 Astro 生成，交互部分使用 React，AI Chat 由 Flask 后端提供，Nginx 让网站与 API 保持同源。仓库还记录了各部分如何测试、部署和维护。',
    storyHeading: '项目由哪些部分组成',
    story: [
      {
        title: '静态页面，按需交互',
        body: '主要页面由 Astro 生成静态 HTML；导航、主题与语言切换、表单、证书信息和 Chat 等交互再由 React 负责，因此公开内容不依赖浏览器完成加载后才能阅读。'
      },
      {
        title: '边界清楚的 AI Chat',
        body: '独立 Chat 页面和首页浮动窗口使用同一个站内地址。导览问题只依据网站和公开仓库信息回答，浮动窗口的加载协议与模型请求分别维护。'
      },
      {
        title: '可以重复执行的测试与交付',
        body: 'Vitest、Playwright 浏览器检查、Astro 构建、GitHub Actions，以及公开记录的 Nginx 与 CSP 约束，让每次变更都能被检查和重复执行。'
      }
    ],
    evidenceHeading: '查看具体实现',
    evidence: [
      {
        label: '阅读参考架构',
        href: '#zh-参考架构',
        note: '了解前端、后端、Nginx 与部署之间的边界。'
      },
      {
        label: '查看 CI/CD 与验证流程',
        href: '#zh-cicd-工作流',
        note: '了解网站如何构建、测试与发布。'
      },
      {
        label: '验证我的 AWS 认证',
        href: CERTIFICATIONS_PAGE_PATH,
        note: '查看证书日期、Credly 徽章与验证入口。'
      },
      {
        label: '询问 PersonalWeb',
        href: CHAT_PAGE_PATH,
        note: '通过基于网站和公开仓库信息的导览问题了解项目。'
      }
    ],
    boundaryHeading: '这个项目不能说明什么',
    boundary:
      'PersonalWeb 是我持续维护的个人项目。它不能说明高流量规模、私人客户系统或大型商业 SaaS；公开文档也不会包含密钥、访客消息、私人日志和服务器细节。',
    nextActions: [
      {
        label: '阅读技术文档',
        href: '#zh-技术栈',
        variant: 'primary'
      },
      {
        label: '验证我的 AWS 认证',
        href: CERTIFICATIONS_PAGE_PATH,
        variant: 'secondary'
      },
      {
        label: '联系我',
        href: '/#contact',
        variant: 'secondary'
      }
    ]
  }
} as const;
