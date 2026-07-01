import {
  CONTACT_EMAIL_PRIMARY,
  CONTACT_PHONE_INTL,
  CONTACT_PHONE_LOCAL,
  SITE_DOMAIN,
  CSDN_ARTICLES,
  MEDIUM_ARTICLES
} from '../constants';

export const ABOUT_CONTENT = {
  en: {
    heroHeading: "Hello! I'm<span> Renda Zhang</span>",
    heroTaglines: [
      'AI Full-Stack Development',
      'Cloud-Native Engineering',
      'Java/Spring Platforms',
      'PersonalWeb Proof',
      'AWS/GCP/Kubernetes'
    ],
    subTitle: 'Who am I?',
    title: 'About Me',
    paragraphs: [
      "Hello! I'm Renda Zhang, a Shenzhen-based engineer building AI-enabled full-stack and cloud-native web systems on a Java/Spring foundation.",
      'In July 2026, I will join OneConnect Financial Technology as a Senior Backend Engineer / Team Lead in the Insurance Business Unit overseas life insurance team.',
      'My flagship proof is PersonalWeb: an Astro/React portfolio with a same-origin AI Chat Widget, Flask/OpenAI backend integration, technical docs, browser smoke coverage, SEO/GEO, and CI/CD delivery.',
      'I design API-first microservices on AWS and GCP, using Kubernetes, Terraform, GitHub Actions/Argo CD, and observability guardrails to ship safely.',
      'I tune high-concurrency paths with Redis, queues, and structured reliability practices, then connect backend decisions to SSR/CSR frontend experiences.',
      'I hold an AWS Solutions Architect – Associate (Jun 2025) and a B.S. in Computer Science from the University of Minnesota.'
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
          ' Leaving Fanxin on Jul 1, 2026; joining OneConnect Financial Technology in the overseas life insurance backend TL role on Jul 6, 2026'
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
      title: 'Skills & Knowledge',
      categories: [
        { label: 'AI Full-Stack Development', level: 94 },
        { label: 'Java & Spring Backend', level: 98 },
        { label: 'Cloud & Platform Engineering', level: 95 },
        { label: 'Microservices & API Design', level: 93 },
        { label: 'Data, Cache & Messaging', level: 92 },
        { label: 'DevOps & CI/CD Automation', level: 92 },
        { label: 'Observability & Reliability', level: 88 },
        { label: 'Communication & Leadership', level: 80 }
      ],
      items: [
        'Java, SQL, TypeScript, JavaScript, Python, HTML/CSS, C/C++, PHP, Clojure',
        'Spring Boot, Spring Cloud, Spring Security, Spring Data JPA, MyBatis, OpenFeign, Resilience4j',
        'Astro, React, TypeScript, SSR, CSR, selective hydration, Chat Widget, Sentry, CSP, BFF',
        'Flask/OpenAI integration, AI chat UI/backend boundaries, Markdown rendering, browser smoke validation',
        'AWS (EKS, ECS, IAM, ALB, S3, CloudFront), GCP, Kubernetes, Docker, Terraform, CDK',
        'Microservices, REST, gRPC, API design, Auth/OAuth2/OIDC, idempotency, rate limiting',
        'MySQL, Aurora, MongoDB, Redis, DynamoDB, ElasticSearch',
        'Kafka, RabbitMQ, SQS, DLQ, retry and dedupe patterns',
        'GitHub Actions, Argo CD, Jenkins, GitLab CI/CD, Maven, Git, Linux Shell',
        'OpenTelemetry, Prometheus, Grafana, SLOs, blue-green and canary releases',
        'JMeter, JUnit, Mockito, Postman, Swagger, SpringDoc',
        'Team collaboration, leadership, problem solving, adaptability',
        'English (Full professional), Chinese (Native: Mandarin & Cantonese)'
      ]
    },
    experience: {
      title: 'Experience',
      summary:
        'Work proof in one scan: the story moves from Android product delivery and freelance Java backend projects into Michaels.com e-commerce platforms, cloud-native SaaS delivery at Fanxin, and a July 2026 OneConnect backend TL role for overseas life insurance systems.',
      entries: [
        {
          period: 'Starts Jul 2026',
          company: 'OneConnect Financial Technology',
          title: 'Senior Backend Engineer / Team Lead - Overseas Life Insurance',
          summary:
            'Incoming role with the Insurance Business Unit overseas life insurance team, leading backend engineers and delivery for insurance platform systems.',
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
        'Education supports the engineering narrative with a Computer Science foundation from the University of Minnesota, U.S. academic experience, and coursework spanning systems, networks, algorithms, software engineering, programming languages, and UI design.',
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
    heroHeading: '你好，我是<span>张人大</span>',
    heroTaglines: [
      'AI 全栈开发',
      '云原生工程',
      'Java/Spring 平台',
      'PersonalWeb 证明',
      'AWS/GCP/Kubernetes'
    ],
    subTitle: '我是谁？',
    title: '自我介绍',
    greeting: '你好，',
    paragraphs: [
      '大家好，我是张人大，常驻深圳，基于 Java/Spring 构建 AI 全栈与云原生 Web 系统。',
      '2026 年 7 月 6 日起，我将加入金融壹账通保险事业部海外寿险团队，担任后端开发高级工程师/TL。',
      'PersonalWeb 是我的旗舰证明：Astro/React 前端、同源 AI Chat Widget、Flask/OpenAI 后端集成、技术文档、浏览器 smoke、SEO/GEO 与 CI/CD 交付闭环。',
      '专注在 AWS 与 GCP 上构建 API-first 微服务，结合 Kubernetes、Terraform、GitHub Actions/Argo CD 和可观测性护栏安全交付。',
      '擅长用 Redis、消息队列与可靠性实践优化高并发链路，并把后端决策连接到 SSR/CSR 前端体验。',
      '持有 AWS 解决方案架构师（助理，2025 年 6 月）认证，本科毕业于美国明尼苏达大学计算机科学专业。'
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
        value: ' 将于 2026 年 7 月 1 日从凡新离职，7 月 6 日加入金融壹账通，任后端开发高级工程师/TL'
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
      title: '技能与能力',
      categories: [
        { label: 'AI 全栈开发', level: 94 },
        { label: 'Java 与 Spring 后端', level: 98 },
        { label: '云原生与平台工程', level: 95 },
        { label: '微服务与 API 设计', level: 93 },
        { label: '数据、缓存与消息', level: 92 },
        { label: 'DevOps 与 CI/CD 自动化', level: 92 },
        { label: '可观测性与可靠性', level: 88 },
        { label: '沟通协作与领导力', level: 80 }
      ],
      items: [
        'Java、SQL、TypeScript、JavaScript、Python、HTML/CSS、C/C++、PHP、Clojure',
        'Spring Boot、Spring Cloud、Spring Security、Spring Data JPA、MyBatis、OpenFeign、Resilience4j',
        'Astro、React、TypeScript、SSR、CSR、渐进水合、Chat Widget、Sentry、CSP、BFF',
        'Flask/OpenAI 集成、AI 聊天前后端边界、Markdown 渲染、浏览器 smoke 验证',
        'AWS（EKS、ECS、IAM、ALB、S3、CloudFront）、GCP、Kubernetes、Docker、Terraform、CDK',
        '微服务、REST、gRPC、API 设计、Auth/OAuth2/OIDC、幂等、限流',
        'MySQL、Aurora、MongoDB、Redis、DynamoDB、ElasticSearch',
        'Kafka、RabbitMQ、SQS，结合去重、重试、死信队列等模式',
        'GitHub Actions、Argo CD、Jenkins、GitLab CI/CD、Maven、Git、Linux Shell',
        'OpenTelemetry、Prometheus、Grafana、SLO、蓝绿发布与金丝雀发布',
        'JMeter、JUnit、Mockito、Postman、Swagger、SpringDoc',
        '团队协作、领导力、问题解决、适应变化',
        '中文（普通话/粤语）、英语（专业工作水平）'
      ]
    },
    experience: {
      title: '经历',
      summary:
        '工作证明主线：从 Android 产品交付和自由职业 Java 后端项目，进入 Michaels.com 企业电商平台，再到凡新云原生 SaaS 交付，并在 2026 年 7 月进入金融壹账通海外寿险后端 TL 岗位。',
      entries: [
        {
          period: '2026年7月起',
          company: '金融壹账通',
          title: '后端开发高级工程师 / TL（保险事业部海外寿险团队）',
          summary:
            '即将加入保险事业部海外寿险团队，负责后端工程团队协作、技术方案、代码质量与保险平台交付。',
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
            '建设多环境 CI/CD、蓝绿/金丝雀、特性开关、仪表盘与 Runbook，保障版本可灰度、可回滚、可排障。',
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
        '教育经历为工程叙事提供计算机科学基础：明尼苏达大学本科、美国学习经历，以及系统、网络、算法、软件工程、编程语言和 UI 设计等课程支撑。',
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
