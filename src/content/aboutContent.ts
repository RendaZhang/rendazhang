import {
  CONTACT_EMAIL_PRIMARY,
  CONTACT_PHONE_INTL,
  CONTACT_PHONE_LOCAL,
  SITE_DOMAIN,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH,
  CSDN_ARTICLES,
  MEDIUM_ARTICLES
} from '../constants';

export const ABOUT_CONTENT = {
  en: {
    heroKicker: 'Senior Backend Engineer / Team Lead',
    heroHeading: 'Renda Zhang',
    heroSummary:
      'I lead backend delivery for overseas life insurance at OneConnect and built PersonalWeb end to end across AI chat, frontend, testing, and delivery.',
    proofPath: {
      eyebrow: 'Where to start',
      title: 'Choose what you want to explore',
      summary:
        'Read how I built PersonalWeb, view my AWS certification, ask the Chat Guide, or contact me directly.',
      actions: [
        {
          label: 'See how I built PersonalWeb',
          note: 'Start with a concise project overview, then continue into architecture, testing, and delivery.',
          href: DOCS_PAGE_PATH
        },
        {
          label: 'View my AWS certification',
          note: 'See what the certification covers and open its public verification page.',
          href: CERTIFICATIONS_PAGE_PATH
        },
        {
          label: 'Ask about me or PersonalWeb',
          note: 'Use the Chat Guide to ask from public information on this site.',
          href: CHAT_PAGE_PATH
        },
        {
          label: 'Contact me',
          note: 'Send me a message after reviewing the project or my experience.',
          href: '#contact'
        }
      ]
    },
    subTitle: 'Who am I?',
    title: 'About Me',
    paragraphs: [
      "I'm a Shenzhen-based AI full-stack and cloud-native engineer. My work is rooted in Java/Spring backend systems, with frontend and AI features shaped around the same product and reliability decisions.",
      'On July 6, 2026, I joined OneConnect Financial Technology as a Senior Backend Engineer / Team Lead in the Insurance Business Unit overseas life insurance team.',
      'I built PersonalWeb end to end with Astro and React, a same-origin AI Chat Widget, a Flask/OpenAI backend, public technical documentation, browser tests, SEO/GEO, and automated delivery.',
      'Across my broader work, I design API-first services on AWS and GCP, Kubernetes delivery, Redis and messaging paths, and observability practices. I also hold the AWS Certified Solutions Architect – Associate certification and a B.S. in Computer Science from the University of Minnesota.'
    ],
    info: [
      { label: 'Name:', value: ' Renda Zhang' },
      { label: 'Gender:', value: ' Male' },
      { label: 'Email:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: 'Phone:', value: ` ${CONTACT_PHONE_INTL}` },
      { label: 'Address:', value: ' Nanshan District, Shenzhen, Guangdong, China 518000' },
      { label: 'Website:', value: ` ${SITE_DOMAIN}` },
      {
        label: 'Status:',
        value:
          ' Left Fanxin on Jul 1, 2026; joined OneConnect Financial Technology in the overseas life insurance backend TL role on Jul 6, 2026'
      },
      {
        label: 'Certifications:',
        value: ' AWS Certified Solutions Architect – Associate (Jun 2025)'
      }
    ],
    resumeLabel: 'Download Resume',
    contact: {
      title: 'Contact Me',
      info: [
        { label: 'Phone', value: ` ${CONTACT_PHONE_INTL}` },
        { label: 'Email', value: ` ${CONTACT_EMAIL_PRIMARY}` },
        { label: 'Address', value: ' Shenzhen, Guangdong, China' }
      ],
      form: {
        placeholders: {
          name: 'Your Name',
          contact: 'Email or Phone',
          subject: 'Subject',
          message: 'Message'
        },
        button: 'Send Message',
        sending: 'Sending...',
        success: 'Sent to my mailbox',
        errorEmpty: 'Please fill all fields',
        failed: 'Failed to send'
      }
    },
    contactLabel: 'Feel free to reach out anytime',
    skills: {
      title: 'What I Work On',
      summary:
        'My work spans four connected areas, from backend service design to the frontend and delivery systems around it.',
      categories: [
        {
          label: 'Backend systems',
          description:
            'Java/Spring services, REST and gRPC APIs, relational and NoSQL data, Redis, and messaging.'
        },
        {
          label: 'AI and frontend',
          description:
            'Astro/React, TypeScript, Flask/OpenAI integration, SSR/CSR, Markdown, CSP, and browser validation.'
        },
        {
          label: 'Cloud delivery',
          description:
            'AWS/GCP, Kubernetes, Docker, Terraform, GitHub Actions, Argo CD, and blue-green or canary releases.'
        },
        {
          label: 'Reliability and teamwork',
          description:
            'OpenTelemetry, Prometheus, Grafana, load testing, code review, delivery planning, and team leadership.'
        }
      ]
    },
    experience: {
      title: 'Experience',
      summary:
        'My work has moved from Android product delivery and freelance Java backend projects to Michaels.com e-commerce platforms, cloud-native SaaS at Fanxin, and my current backend team-lead role for overseas life insurance systems at OneConnect.',
      entries: [
        {
          period: 'Jul 2026 - Present',
          company: 'OneConnect Financial Technology',
          title: 'Senior Backend Engineer / Team Lead - Overseas Life Insurance',
          summary:
            'Current role with the Insurance Business Unit overseas life insurance team, leading backend engineers and delivery for insurance platform systems.',
          bullets: [
            'Lead engineering goals, delivery feedback, and development planning for backend team members.',
            'Partner with product managers and local/global engineering teams to turn insurance product requirements into technical plans.',
            'Design, review, and deliver Java backend services for distributed, high-concurrency, and high-availability systems while maintaining code review, REST/HTTP integration, Docker delivery, and service quality standards.'
          ]
        },
        {
          period: 'Jun 2024 - Jul 2026',
          company: 'Shenzhen Fanxin Technology',
          title: 'Java Backend Engineer - Cloud-Native',
          summary:
            'API-first SaaS with merchant console, developer portal, and embeddable widgets; led Java backend and cloud-native delivery.',
          bullets: [
            'Drove microservice design and API contracts, strengthening auth, idempotency, and rate limiting with OpenAPI-driven docs and SDKs.',
            'Built multi-environment CI/CD with blue-green, canary, feature flags, actionable dashboards, and runbooks for safer releases and rollback.',
            'Ran services on Kubernetes with probe gates, HPA elasticity, immutable images, config-as-code, and least-privilege access.',
            'Optimized data paths with relational storage, Redis, queues, dedupe, retry, and DLQ patterns while partnering with frontend on SSR/CSR choices and Sentry event correlation.'
          ]
        },
        {
          period: 'Nov 2020 - Apr 2024',
          company: 'Michaels (Shenzhen) Technology Services Co., Ltd.',
          title: 'Software Development Engineer - Backend',
          summary:
            'Built Michaels.com e-commerce platform and core PLM/MakerPlace services serving global consumers and sellers.',
          bullets: [
            'Architected and launched the consumer-facing Michaels.com platform handling high-volume traffic and order journeys.',
            'Led GCP Kubernetes/Docker deployments, CI/CD automation, release preparation, logging, configuration, data warm-ups, and database migrations across environments.',
            'Established Scrum rituals and governance as the team scaled from ~15 to 300 engineers while coordinating frontend, QA, and DevOps delivery.',
            'Directed PLM and MakerPlace backend modules across onboarding, inventory, orders, users, supplier integrations, reporting, and secure REST APIs.',
            'Conducted API load testing with JMeter, pinpointing bottlenecks and tuning MongoDB indexes and payloads for ~30% throughput gains.',
            'Implemented backend behavior tracking for funnel analysis and PLM lifecycle improvements that reduced stockouts by 15%.'
          ]
        },
        {
          period: 'Jun 2020 - Nov 2020',
          company: 'Online Education Platform (Freelance)',
          title: 'Backend Developer',
          summary:
            'Freelance Java backend work focused on high-concurrency course access, asynchronous workflows, caching, and search.',
          bullets: [
            'Split services with Spring Boot and Spring Cloud, introduced RabbitMQ/Kafka messaging and Redis caching, and used Docker plus ElasticSearch for isolated delivery and content search.'
          ]
        },
        {
          period: 'Nov 2019 - May 2020',
          company: 'E-commerce Mall Platform (Freelance)',
          title: 'Backend Developer',
          summary:
            'Freelance e-commerce backend project covering Spring Cloud services, product modeling, data stores, cache strategy, and cloud SMS integration.',
          bullets: [
            'Built Spring Cloud microservices with MySQL, MongoDB, and Redis; designed SKU/SPU models; integrated Alibaba Cloud SMS; and improved concurrency, database structure, and caching.'
          ]
        },
        {
          period: 'May 2018 - Jun 2019',
          company: 'Samsung Mobile R&D Center - Guangzhou',
          title: 'Software Engineer - Android Application',
          summary:
            'Early product engineering role connecting Android application delivery, account security, analytics instrumentation, QA automation, and cross-functional release work.',
          bullets: [
            'Delivered feedback modules and guided the merger of Galaxy Community and Samsung Space applications.',
            'Implemented Samsung account OAuth2 login with JWT security and instrumented Baidu/Adobe analytics aligned with backend event logging.',
            'Handled Android compatibility, verification and market issue fixes, UI automation, patent discussions, certification testing, and agile coordination.'
          ]
        }
      ]
    },
    blog: {
      title: 'Blog',
      entries: [
        {
          category: 'Medium',
          title: 'Quantitative Trading 101: Building Your AI Trading Bot from Scratch',
          date: '2024-03-15',
          url: MEDIUM_ARTICLES.QUANT_TRADING_AI_BOT
        }
      ]
    },
    education: {
      title: 'Education',
      summary:
        'I studied Computer Science at the University of Minnesota, with coursework across systems, networks, algorithms, software engineering, programming languages, and UI design.',
      entries: [
        {
          period: 'Sep 2014 - Dec 2017',
          school: 'University of Minnesota - Twin Cities',
          degree: 'Bachelor of Science in Computer Science',
          details:
            'College of Science and Engineering; GPA: 3.79. Core courses: Data Structures & Algorithms, Software Engineering, Operating Systems, Computer Networking, Programming Languages, Internet Programming, UI Design, and Theory of Computation.'
        },
        {
          period: 'Aug 2012 - Jun 2014',
          school: 'Lee Academy, Maine',
          degree: 'High School Diploma',
          details:
            'Completed college-preparatory curriculum in the U.S. with activities in cross-country, math tutoring, and part-time work.'
        }
      ]
    }
  },
  zh: {
    heroKicker: '后端开发高级工程师 / TL',
    heroHeading: '张人大',
    heroSummary:
      '我在金融壹账通负责海外寿险后端交付，也端到端构建了 PersonalWeb，覆盖 AI 聊天、前端、测试与发布。',
    proofPath: {
      eyebrow: '从这里开始',
      title: '选择你想了解的内容',
      summary:
        '你可以了解我如何构建 PersonalWeb，查看 AWS 认证，向 Chat Guide 提问，或直接联系我。',
      actions: [
        {
          label: '了解我如何构建 PersonalWeb',
          note: '先看简明项目介绍，再继续阅读架构、测试与发布细节。',
          href: DOCS_PAGE_PATH
        },
        {
          label: '查看我的 AWS 认证',
          note: '了解认证覆盖的内容，并打开公开验证页面。',
          href: CERTIFICATIONS_PAGE_PATH
        },
        {
          label: '询问我或 PersonalWeb',
          note: 'Chat Guide 会根据本站公开信息回答。',
          href: CHAT_PAGE_PATH
        },
        {
          label: '联系我',
          note: '了解项目或经历后，可以直接给我留言。',
          href: '#contact'
        }
      ]
    },
    subTitle: '我是谁？',
    title: '自我介绍',
    greeting: '你好，',
    paragraphs: [
      '我常驻深圳，专注 AI 全栈与云原生工程。我的技术基础是 Java/Spring 后端，同时会把前端和 AI 功能放在同一套产品与可靠性决策中考虑。',
      '我于 2026 年 7 月 6 日加入金融壹账通保险事业部海外寿险团队，担任后端开发高级工程师/TL。',
      'PersonalWeb 由我端到端构建，包含 Astro/React 前端、同源 AI Chat Widget、Flask/OpenAI 后端、公开技术文档、浏览器测试、SEO/GEO 与自动化发布。',
      '在其他项目中，我也长期处理 AWS/GCP 上的 API-first 服务、Kubernetes 交付、Redis、消息队列与可观测性。持有 AWS 认证解决方案架构师 – 助理认证，本科毕业于明尼苏达大学计算机科学专业。'
    ],
    info: [
      { label: '姓名:', value: ' 张人大' },
      { label: '性别:', value: ' 男' },
      { label: '邮箱:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: '电话:', value: ` ${CONTACT_PHONE_LOCAL}` },
      { label: '地址:', value: ' 中国广东省深圳市南山区 518000' },
      { label: '网站:', value: ` ${SITE_DOMAIN}` },
      {
        label: '状态:',
        value:
          ' 已于 2026 年 7 月 1 日从凡新离职，并于 7 月 6 日加入金融壹账通，任后端开发高级工程师/TL'
      },
      {
        label: '认证:',
        value: ' AWS 认证解决方案架构师 – 助理（2025 年 6 月）'
      }
    ],
    resumeLabel: '下载我的简历',
    contact: {
      title: '联系我吧',
      info: [
        { label: '手机', value: ` ${CONTACT_PHONE_LOCAL}` },
        { label: '邮箱', value: ` ${CONTACT_EMAIL_PRIMARY}` },
        { label: '地址', value: ' 广东省深圳市' }
      ],
      form: {
        placeholders: {
          name: '你的名字',
          contact: '你的联系方式',
          subject: '主题',
          message: '内容描述'
        },
        button: '发送消息',
        sending: '发送中...',
        success: '已经发送到我的邮箱哦',
        errorEmpty: '请填写所有字段',
        failed: '发送失败'
      }
    },
    contactLabel: '欢迎随时联系我',
    skills: {
      title: '我的工作领域',
      summary: '我的工作主要贯穿四个相互连接的领域，从后端服务设计延伸到前端体验与交付体系。',
      categories: [
        {
          label: '后端系统',
          description: 'Java/Spring 服务、REST 与 gRPC API、关系型与 NoSQL 数据、Redis 和消息队列。'
        },
        {
          label: 'AI 与前端',
          description:
            'Astro/React、TypeScript、Flask/OpenAI 集成、SSR/CSR、Markdown、CSP 与浏览器验证。'
        },
        {
          label: '云端交付',
          description:
            'AWS/GCP、Kubernetes、Docker、Terraform、GitHub Actions、Argo CD，以及蓝绿与金丝雀发布。'
        },
        {
          label: '可靠性与团队协作',
          description: 'OpenTelemetry、Prometheus、Grafana、压测、代码审查、交付规划与团队带领。'
        }
      ]
    },
    experience: {
      title: '经历',
      summary:
        '我的经历从 Android 产品交付与自由职业 Java 后端项目，延伸到 Michaels.com 电商平台、凡新的云原生 SaaS，以及目前在金融壹账通负责海外寿险后端团队与交付的工作。',
      entries: [
        {
          period: '2026年7月 - 至今',
          company: '金融壹账通',
          title: '后端开发高级工程师 / TL（保险事业部海外寿险团队）',
          summary:
            '现任保险事业部海外寿险团队后端开发高级工程师/TL，负责团队协作、技术方案、代码质量与保险平台交付。',
          bullets: [
            '带领工程师团队设定目标，跟进交付反馈和发展计划。',
            '与产品经理协作分析保险产品需求，制定技术方案和执行计划。',
            '参与 Java 后端服务设计、评审和交付，维护代码审查、REST/HTTP 集成、Docker 交付与服务质量标准。'
          ]
        },
        {
          period: '2024年6月 - 2026年7月',
          company: '深圳市凡新科技有限公司',
          title: 'Java 后端开发工程师（云原生方向）',
          summary:
            '面向 B 端的 API-first SaaS，提供管理控制台、开发者门户与嵌入式组件，曾负责后端与云原生交付。',
          bullets: [
            '主导微服务建模与接口契约，完善鉴权、幂等与限流策略，并结合 OpenAPI 沉淀文档与 SDK。',
            '建设多环境 CI/CD、蓝绿/金丝雀、特性开关、仪表盘与运维手册，保障版本可灰度、可回滚、可排障。',
            '在 Kubernetes 上治理弹性与探针机制，保持镜像不可变、配置即代码与最小权限原则。',
            '结合关系型存储、Redis、消息队列、去重/重试/死信模式优化数据链路，并与前端协作 SSR/CSR 策略和 Sentry 事件串联。'
          ]
        },
        {
          period: '2020年11月 - 2024年4月',
          company: '麦克尔斯（深圳）科技服务有限公司',
          title: '后端开发工程师',
          summary: '搭建 Michaels.com 电商平台及 PLM/MakerPlace 核心服务，面向全球消费者与卖家。',
          bullets: [
            '主导从 0 到 1 的 Michaels.com 平台架构，承载高并发访问与完整订单链路。',
            '负责 GCP Kubernetes/Docker 多环境部署、CI/CD 自动化、发布准备、日志、配置、数据预热与数据库迁移。',
            '在团队从约 15 人扩张至 300+ 过程中推进 Scrum 节奏与治理，并协调前端、QA、DevOps 持续交付。',
            '牵头 PLM 与 MakerPlace 后端模块，覆盖入驻、库存、订单、用户、供应商整合、报表与安全 REST API。',
            '使用 JMeter 压测 API，定位瓶颈并优化 MongoDB 索引与负载，吞吐提升约 30%。',
            '构建后端行为埋点支撑转化漏斗分析，并通过 PLM 生命周期优化将缺货率下降 15%。'
          ]
        },
        {
          period: '2020年6月 - 2020年11月',
          company: '教育平台项目（自由职业）',
          title: 'Java 后端开发',
          summary: '自由职业 Java 后端项目，重点处理高并发课程访问、异步流程、缓存和内容检索。',
          bullets: [
            '使用 Spring Boot/Spring Cloud 拆分服务，引入 RabbitMQ/Kafka、Redis、Docker 与 ElasticSearch，支持课程访问、异步处理、缓存和检索。'
          ]
        },
        {
          period: '2019年11月 - 2020年5月',
          company: '商城项目（自由职业）',
          title: 'Java 后端开发',
          summary:
            '自由职业电商后端项目，覆盖 Spring Cloud 服务、商品建模、数据存储、缓存策略和云短信集成。',
          bullets: [
            '基于 Spring Cloud、MySQL、MongoDB、Redis 构建电商系统，完成 SPU/SKU 建模、阿里云短信集成，并优化并发、数据库结构与缓存。'
          ]
        },
        {
          period: '2018年5月 - 2019年6月',
          company: '三星广州通信技术研究有限公司',
          title: '软件工程师 - Android 应用',
          summary:
            '早期产品工程经历，连接 Android 应用交付、账号安全、数据埋点、QA 自动化与跨团队发布协作。',
          bullets: [
            '负责盖乐世社区与盖乐世空间合并期间的反馈模块研发与上线。',
            '实现三星账号 OAuth2 登录与 JWT 安全策略，并接入百度统计、Adobe Analytics 与后端事件日志。',
            '处理 Android 兼容性、验证与市场反馈、UI 自动化、专利研讨、认证测试和敏捷协作。'
          ]
        }
      ]
    },
    blog: {
      title: '博客',
      entries: [
        {
          category: 'CSDN',
          title: 'Java 21 实战：虚拟线程让 Tomcat 停摆，我在 Task‑System 中找到那把“失踪的锁”',
          date: '2025-06-09',
          url: CSDN_ARTICLES.JAVA_21_LOCK
        }
      ]
    },
    education: {
      title: '教育',
      summary:
        '我在明尼苏达大学学习计算机科学，课程涵盖系统、网络、算法、软件工程、编程语言与 UI 设计。',
      entries: [
        {
          period: '2014年9月 - 2017年12月',
          school: '明尼苏达大学双城校区',
          degree: '计算机科学 理学学士',
          details:
            '主修课程包括：程序设计、软件工程、数据库系统、操作系统、网络编程、形式语言与自动机、算法与数据结构、编程语言原理等。 GPA 3.79。'
        },
        {
          period: '2012年8月 - 2014年6月',
          school: '美国缅因州李学院',
          degree: '高中学历',
          details: '完成大学预科课程，参与越野跑、数学辅导及兼职工作。'
        }
      ]
    }
  }
} as const;
