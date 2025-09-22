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
      'Backend Engineer',
      'Java & Spring Boot',
      'Cloud-Native Platform',
      'Kubernetes & Terraform',
      'CI/CD Automation'
    ],
    subTitle: 'Who am I?',
    title: 'About Me',
    paragraphs: [
      "Hello! I'm Renda Zhang, a backend engineer based in Shenzhen, China with five years of Java/Spring delivery.",
      'I design API-first microservices on AWS and GCP, using Kubernetes, Terraform, and GitHub Actions/Argo CD to ship safely.',
      'I build observability and performance guardrails end to end, tuning high-concurrency paths with Redis and message queues.',
      'I partner with frontend teams on SSR/CSR experiences, instrumentation, and selective hydration for merchant-facing products.',
      'I hold an AWS Solutions Architect – Associate (Jun 2025) and a B.S. in Computer Science from the University of Minnesota.'
    ],
    info: [
      { label: 'Name:', value: ' Renda Zhang' },
      { label: 'Gender:', value: ' Male' },
      { label: 'Email:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: 'Phone:', value: ` ${CONTACT_PHONE_INTL}` },
      { label: 'Address:', value: ' Nanshan District, Shenzhen, Guangdong, China 518000' },
      { label: 'Website:', value: ` ${SITE_DOMAIN}` },
      { label: 'Status:', value: ' Open to cloud-native backend roles (1-month notice)' },
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
        { label: 'Java & Spring Backend', level: 98 },
        { label: 'Cloud & Platform Engineering', level: 95 },
        { label: 'Microservices & API Design', level: 93 },
        { label: 'Data Stores & Caching', level: 94 },
        { label: 'Messaging & Eventing', level: 90 },
        { label: 'DevOps & CI/CD Automation', level: 92 },
        { label: 'Observability & Reliability', level: 88 },
        { label: 'Communication & Leadership', level: 80 }
      ],
      items: [
        'Java, SQL, HTML/CSS, JavaScript, Python, C/C++, PHP, Clojure',
        'Spring Boot, Spring Cloud, Spring Security, Spring Data JPA, MyBatis, OpenFeign, Resilience4j',
        'Microservices, REST, gRPC, API design, Auth/OAuth2/OIDC, idempotency, rate limiting',
        'AWS (EKS, ECS, IAM, ALB, S3, CloudFront), GCP, Kubernetes, Docker, Terraform, CDK',
        'MySQL, Aurora, MongoDB, Redis, DynamoDB, ElasticSearch',
        'Kafka, RabbitMQ, SQS, DLQ, retry and dedupe patterns',
        'GitHub Actions, Argo CD, Jenkins, GitLab CI/CD, Maven, Git, Linux Shell',
        'OpenTelemetry, Prometheus, Grafana, SLOs, blue-green and canary releases',
        'JMeter, JUnit, Mockito, Postman, Swagger, SpringDoc',
        'React, TypeScript, SSR, CSR, selective hydration, Sentry, CSP, BFF',
        'Team collaboration, leadership, problem solving, adaptability',
        'English (Full professional), Chinese (Native: Mandarin & Cantonese)'
      ]
    },
    experience: {
      title: 'Experience',
      entries: [
        {
          period: 'Jun 2024 - Present',
          company: 'Shenzhen Fanxin Technology',
          title: 'Java Backend Engineer - Cloud-Native',
          summary:
            'API-first SaaS with merchant console, developer portal, and embeddable widgets; lead Java backend and cloud-native delivery.',
          bullets: [
            'Drove microservice design and API contracts, strengthening auth, idempotency, and rate limiting with OpenAPI-driven docs and SDKs.',
            'Built multi-environment CI/CD with blue-green, canary, and feature flags for safe releases and rapid rollback.',
            'Established observability across metrics, traces, and structured logs with actionable dashboards and runbooks.',
            'Ran services on Kubernetes with probe gates, HPA elasticity, immutable images, config-as-code, and least-privilege access.',
            'Optimized data paths via relational storage plus Redis caching and decoupled flows with queues using dedupe, retry, and DLQ patterns.',
            'Partnered with frontend on merchant console, developer portal, and widgets, aligning SSR/CSR choices and correlating Sentry events.'
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
            'Led Kubernetes and Docker deployments on GCP across dev, staging, and prod with automated CI/CD pipelines.',
            'Established Scrum rituals and governance as the team scaled from ~15 to 300 engineers.',
            'Directed backend for PLM and MakerPlace modules spanning onboarding, inventory, orders, and user systems.',
            'Coordinated with frontend, QA, and DevOps for continuous delivery, canary releases, and high-frequency deployments.',
            'Maintained environment configs, logging, and integrations while preparing data warm-ups and database migrations for smooth releases.',
            'Developed unit and integration tests with JUnit and Mockito, sustaining GitLab CI/CD quality gates.',
            'Conducted API load testing with JMeter, pinpointing bottlenecks and tuning MongoDB indexes and payloads for ~30% throughput gains.',
            'Implemented backend tracking for user behaviors, powering funnel analysis and business insights.',
            'Led PLM enhancements for lifecycle tracking, supplier integrations, and reporting, reducing stockouts by 15%.',
            'Delivered MakerPlace seller onboarding, secure auth with JWT rotation and OAuth2, and well-documented REST APIs.'
          ]
        },
        {
          period: 'Jun 2020 - Nov 2020',
          company: 'Online Education Platform (Freelance)',
          title: 'Backend Developer',
          bullets: [
            'Split services with Spring Boot and Spring Cloud to handle high-concurrency course access.',
            'Introduced RabbitMQ and Kafka for async messaging and used Redis caching for performance.',
            'Used Docker for isolated environments and ElasticSearch for content search.'
          ]
        },
        {
          period: 'Nov 2019 - May 2020',
          company: 'E-commerce Mall Platform (Freelance)',
          title: 'Backend Developer',
          bullets: [
            'Built Spring Cloud microservices with MySQL, MongoDB, and Redis to support e-commerce operations.',
            'Designed SKU/SPU data models and integrated SMS via Alibaba Cloud.',
            'Improved concurrency handling and optimized database structure and caching strategies.'
          ]
        },
        {
          period: 'May 2018 - Jun 2019',
          company: 'Samsung Mobile R&D Center - Guangzhou',
          title: 'Software Engineer - Android Application',
          bullets: [
            'Delivered feedback modules and guided the merger of Galaxy Community and Samsung Space applications.',
            'Implemented Samsung account OAuth2 login with JWT-based security and authorization policies.',
            'Instrumented Baidu and Adobe analytics, aligning event schemas with backend logging for behavior analysis.',
            'Ensured Android compatibility, triaged verification and market issues, and drove production fixes.',
            'Built and maintained Android UI automation scripts, boosting regression stability and release efficiency.',
            'Coordinated patent discussions, certification testing, and agile ceremonies with cross-functional teams.'
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
      '后端工程师',
      'Java 与 Spring Boot',
      '云原生平台',
      'Kubernetes 与 Terraform',
      'CI/CD 自动化'
    ],
    subTitle: '我是谁？',
    title: '自我介绍',
    greeting: '你好，',
    paragraphs: [
      '大家好，我是张人大，常驻深圳的后端工程师，拥有 5 年 Java/Spring 交付经验。',
      '专注在 AWS 与 GCP 上构建 API-first 微服务，结合 Kubernetes、Terraform、GitHub Actions/Argo CD 安全交付。',
      '擅长建立端到端可观测性与性能防护体系，利用 Redis 与消息队列优化高并发链路。',
      '与前端团队共建商家控制台等产品，按需选择 SSR/CSR/渐进水合并贯通埋点。',
      '持有 AWS 解决方案架构师（助理，2025 年 6 月）认证，本科毕业于美国明尼苏达大学计算机科学专业。'
    ],
    info: [
      { label: '姓名:', value: ' 张人大' },
      { label: '性别:', value: ' 男' },
      { label: '邮箱:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: '电话:', value: ` ${CONTACT_PHONE_LOCAL}` },
      { label: '地址:', value: ' 中国广东省深圳市南山区 518000' },
      { label: '网站:', value: ` ${SITE_DOMAIN}` },
      { label: '状态:', value: ' 积极寻找后端/云原生开发岗位（一个月内可入职）' },
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
        { label: 'Java 与 Spring 后端', level: 98 },
        { label: '云原生与平台工程', level: 95 },
        { label: '微服务与 API 设计', level: 93 },
        { label: '数据存储与缓存', level: 94 },
        { label: '消息队列与事件驱动', level: 90 },
        { label: 'DevOps 与 CI/CD 自动化', level: 92 },
        { label: '可观测性与可靠性', level: 88 },
        { label: '沟通协作与领导力', level: 80 }
      ],
      items: [
        'Java、SQL、HTML/CSS、JavaScript、Python、C/C++、PHP、Clojure',
        'Spring Boot、Spring Cloud、Spring Security、Spring Data JPA、MyBatis、OpenFeign、Resilience4j',
        '微服务、REST、gRPC、API 设计、Auth/OAuth2/OIDC、幂等、限流',
        'AWS（EKS、ECS、IAM、ALB、S3、CloudFront）、GCP、Kubernetes、Docker、Terraform、CDK',
        'MySQL、Aurora、MongoDB、Redis、DynamoDB、ElasticSearch',
        'Kafka、RabbitMQ、SQS，结合去重、重试、死信队列等模式',
        'GitHub Actions、Argo CD、Jenkins、GitLab CI/CD、Maven、Git、Linux Shell',
        'OpenTelemetry、Prometheus、Grafana、SLO、蓝绿发布与金丝雀发布',
        'JMeter、JUnit、Mockito、Postman、Swagger、SpringDoc',
        'React、TypeScript、SSR、CSR、渐进水合、Sentry、CSP、BFF',
        '团队协作、领导力、问题解决、适应变化',
        '中文（普通话/粤语）、英语（专业工作水平）'
      ]
    },
    experience: {
      title: '经历',
      entries: [
        {
          period: '2024年6月 - 至今',
          company: '深圳市凡新科技有限公司',
          title: 'Java 后端开发工程师（云原生方向）',
          summary:
            '面向 B 端的 API-first SaaS，提供管理控制台、开发者门户与嵌入式组件，负责后端与云原生交付。',
          bullets: [
            '主导微服务建模与接口契约，完善鉴权、幂等与限流策略，并结合 OpenAPI 沉淀文档与 SDK。',
            '建设多环境 CI/CD 流程，引入蓝绿、金丝雀与特性开关，保障版本可灰度可回滚。',
            '搭建指标、链路、结构化日志一体的可观测体系，编制仪表盘与 Runbook 支撑排障。',
            '在 Kubernetes 上治理弹性与探针机制，保持镜像不可变、配置即代码与最小权限原则。',
            '结合关系型存储与 Redis 缓存优化读写，引入消息队列去重/重试/死信模式解耦流程。',
            '与前端共建商家控制台、开发者门户与嵌入式组件，匹配 SSR/CSR 策略并串联 Sentry 事件。'
          ]
        },
        {
          period: '2020年11月 - 2024年4月',
          company: '麦克尔斯（深圳）科技服务有限公司',
          title: '后端开发工程师',
          summary: '搭建 Michaels.com 电商平台及 PLM/MakerPlace 核心服务，面向全球消费者与卖家。',
          bullets: [
            '主导从 0 到 1 的 Michaels.com 平台架构，承载高并发访问与完整订单链路。',
            '负责 GCP 上的 Kubernetes/Docker 多环境部署与 CI/CD 自动化发布。',
            '在团队从约 15 人扩张至 300+ 过程中持续推进 Scrum 节奏与治理。',
            '牵头 PLM 与 MakerPlace 核心模块，覆盖商品入驻、库存、订单与用户体系。',
            '与前端、QA、DevOps 协同实现持续交付、金丝雀发布与高频上线。',
            '维护配置、日志与集成参数，编制数据预热与数据库迁移脚本，确保平滑上线。',
            '编写 JUnit/Mockito 单元与集成测试，支撑 GitLab CI/CD 质量闸口。',
            '使用 JMeter 压测 API，定位瓶颈并优化 MongoDB 索引与负载，吞吐提升约 30%。',
            '构建后端行为埋点，支撑转化漏斗与业务分析。',
            '在 PLM 模块中完善生命周期跟踪、供应商整合与报表，缺货率下降 15%。',
            '在 MakerPlace 模块中交付商家入驻、JWT 轮换、OAuth2 登录与标准化 REST API。'
          ]
        },
        {
          period: '2020年6月 - 2020年11月',
          company: '教育平台项目（自由职业）',
          title: 'Java 后端开发',
          bullets: [
            '使用 Spring Boot、Spring Cloud 进行微服务拆分，支持高并发课程访问。',
            '引入 RabbitMQ、Kafka 构建异步消息机制，并利用 Redis 缓存提升性能。',
            '借助 Docker 实现环境隔离，使用 ElasticSearch 支持内容检索。'
          ]
        },
        {
          period: '2019年11月 - 2020年5月',
          company: '商城项目（自由职业）',
          title: 'Java 后端开发',
          bullets: [
            '基于 Spring Cloud 微服务架构构建电商系统，整合 MySQL、MongoDB、Redis 等技术。',
            '完成商品 SPU/SKU 建模、订单管理、购物车、短信服务等业务功能。',
            '提升并发处理能力，优化数据库结构与缓存策略。'
          ]
        },
        {
          period: '2018年5月 - 2019年6月',
          company: '三星广州通信技术研究有限公司',
          title: '软件工程师 - Android 应用',
          bullets: [
            '负责盖乐世社区与盖乐世空间合并期间的反馈模块研发与上线。',
            '实现三星账号 OAuth2 登录与 JWT 安全策略，统一授权流程。',
            '接入百度统计与 Adobe Analytics，设计事件结构并联调后端日志。',
            '保障 Android 兼容性，响应验证及市场反馈并推动问题修复。',
            '编写维护 Android UI 自动化脚本，提升回归效率与稳定性。',
            '协调专利研讨、认证测试与敏捷协作，衔接设计、测试与产品团队。'
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
