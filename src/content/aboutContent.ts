import {
  CONTACT_EMAIL_PRIMARY,
  CONTACT_PHONE_INTL,
  CONTACT_PHONE_LOCAL,
  SITE_BASE_URL,
  CSDN_ARTICLES,
  MEDIUM_ARTICLES
} from '../constants';

export const ABOUT_CONTENT = {
  en: {
    heroHeading: "I'm<span> Renda Zhang</span>",
    heroTaglines: [
      'Backend Engineer',
      'Java & Spring Developer',
      'Cloud-Native Microservices',
      'Kubernetes & Terraform',
      'CI/CD Automation'
    ],
    subTitle: 'Who am I?',
    title: 'About Me',
    paragraphs: [
      "Hello! I'm Renda Zhang, a backend engineer based in Shenzhen, China.",
      'I build cloud-native Java and Spring microservices on GCP and AWS using Kubernetes and Terraform.',
      'I automate CI/CD pipelines and tune high-concurrency systems.',
      'I collaborate in agile, English-speaking teams and can work with Node.js and TypeScript when needed.',
      'I hold a B.S. in Computer Science from the University of Minnesota and am open to new cloud-native backend roles.'
    ],
    info: [
      { label: 'Name:', value: ' Renda Zhang' },
      { label: 'Gender:', value: ' Male' },
      { label: 'Email:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: 'Phone:', value: ` ${CONTACT_PHONE_INTL}` },
      { label: 'Address:', value: ' Nanshan District, Shenzhen, Guangdong, China 518000' },
      { label: 'Website:', value: ` ${SITE_BASE_URL}` },
      { label: 'Status:', value: ' Open to cloud-native backend roles (1-month notice)' }
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
        { label: 'Cloud & Containerization', level: 95 },
        { label: 'Microservices & Architecture', level: 92 },
        { label: 'Database & Caching', level: 95 },
        { label: 'Messaging Systems', level: 90 },
        { label: 'DevOps & CI/CD', level: 90 },
        { label: 'Testing & Performance', level: 88 },
        { label: 'Languages & Collaboration', level: 75 }
      ],
      items: [
        'Java, SQL, HTML/CSS, JavaScript, Python, C/C++, PHP, Clojure',
        'Spring Boot, Spring Cloud, Spring Security, Spring Data JPA, MyBatis, OpenFeign, Resilience4j',
        'GCP, AWS (EC2, ECS, EKS, Lambda, S3), Kubernetes, Docker, Terraform',
        'MySQL, MongoDB, Redis, ElasticSearch, Aurora, DynamoDB',
        'RabbitMQ, Kafka, SQS, Step Functions',
        'Eureka, Spring Cloud Gateway, Load Balancing, Circuit Breaking',
        'JWT, OAuth2, SpringDoc OpenAPI, Swagger',
        'Jenkins, GitLab CI/CD, GitHub Actions, Maven, Git, Linux Shell, Nginx',
        'JMeter, JUnit, Mockito',
        'Node.js / TypeScript (basic)',
        'RESTful API design & Agile collaboration',
        'English (Full professional), Chinese (Native)'
      ]
    },
    experience: {
      title: 'Experience',
      entries: [
        {
          period: 'Jun 2024 - Present',
          company: 'Shenzhen Fanxin Technology',
          title: 'Java Backend Engineer - Cloud-Native',
          summary: 'Cross-border SaaS team delivering AWS-based order and inventory services.',
          bullets: [
            'Designed and maintained 6 Spring Boot microservices on AWS ECS Fargate handling 80k-150k requests per day and spikes over 1.2k QPS.',
            'Built IaC pipelines with Terraform and AWS CDK to provision Dev, Stage, and Prod environments in under 20 minutes.',
            'Re-architected bulk inventory sync with Lambda, SQS, and Step Functions, cutting processing time from ~25 minutes to 7 minutes.',
            'Introduced Redis Cluster and Aurora read replicas, lifting cache hit rate to ~96% and reducing MTTR by 45%.',
            'Established GitHub Actions and AWS CodePipeline CI/CD with CloudWatch, Grafana, and X-Ray monitoring.'
          ]
        },
        {
          period: 'Nov 2020 - Apr 2024',
          company: 'Michaels (Shenzhen) Technology Services Co., Ltd.',
          title: 'Software Development Engineer - Backend',
          summary:
            'Built the Michaels.com e-commerce backend including PLM and MakerPlace modules.',
          bullets: [
            'Architected containerized deployments on GCP with Kubernetes and Docker plus CI/CD automation.',
            'Led PLM lifecycle tracking, supplier integration, and analytics, reducing stockouts by 15%.',
            'Developed MakerPlace seller onboarding, product listing, and order management with JWT rotation and OAuth2 login.',
            'Optimized MongoDB indexes and API payloads, improving throughput by ~30%.',
            'Collaborated with frontend, QA, and DevOps teams in Scrum for frequent, reliable releases.'
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
            'Developed feedback modules and app integration features for Galaxy apps.',
            'Implemented Samsung account OAuth2 login with JWT-based authentication.',
            'Embedded Baidu and Adobe analytics for user behavior tracking.',
            'Created Android UI automation scripts to improve regression stability.',
            'Collaborated using Agile, Git, and Gerrit; participated in patent discussions.'
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
    heroHeading: '我是<span>张人大</span>',
    heroTaglines: [
      '后端工程师',
      'Java 与 Spring 开发',
      '云原生微服务',
      'Kubernetes 与 Terraform',
      'CI/CD 自动化'
    ],
    subTitle: '我是谁？',
    title: '自我介绍',
    greeting: '你好，',
    paragraphs: [
      '大家好，我是张人大，居住在中国深圳的后端工程师。',
      '使用 Kubernetes 与 Terraform 在 GCP 与 AWS 上构建基于 Java 与 Spring 的云原生微服务。',
      '负责 CI/CD 流水线自动化并优化高并发系统性能。',
      '在敏捷英语团队中合作自如，必要时能阅读和编写 Node.js 与 TypeScript 服务。',
      '毕业于美国明尼苏达大学双城校区计算机科学专业，正积极寻找后端/云原生开发岗位。'
    ],
    info: [
      { label: '姓名:', value: ' 张人大' },
      { label: '性别:', value: ' 男' },
      { label: '邮箱:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: '电话:', value: ` ${CONTACT_PHONE_LOCAL}` },
      { label: '地址:', value: ' 中国广东省深圳市南山区 518000' },
      { label: '个人网站:', value: ` ${SITE_BASE_URL}` },
      { label: '状态:', value: ' 积极寻找后端/云原生开发岗位（一个月内可入职）' }
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
        { label: '云原生与容器化', level: 95 },
        { label: '微服务架构', level: 92 },
        { label: '数据库与缓存', level: 95 },
        { label: '消息队列与异步', level: 90 },
        { label: 'DevOps 与 CI/CD', level: 90 },
        { label: '测试与性能优化', level: 88 },
        { label: '语言与协作', level: 75 }
      ],
      items: [
        'Java、SQL、HTML/CSS、JavaScript、Python、C/C++、PHP、Clojure',
        'Spring Boot、Spring Cloud、Spring Security、Spring Data JPA、MyBatis、OpenFeign、Resilience4j',
        'GCP、AWS（EC2、ECS、EKS、Lambda、S3）、Kubernetes、Docker、Terraform',
        'MySQL、MongoDB、Redis、ElasticSearch、Aurora、DynamoDB',
        'RabbitMQ、Kafka、SQS、Step Functions',
        'Eureka、Spring Cloud Gateway、负载均衡、熔断',
        'JWT、OAuth2、SpringDoc OpenAPI、Swagger',
        'Jenkins、GitLab CI/CD、GitHub Actions、Maven、Git、Linux Shell、Nginx',
        'JMeter、JUnit、Mockito',
        'Node.js / TypeScript（基础）',
        'RESTful API 设计与敏捷协作',
        '中文（母语）、英语（专业工作水平）'
      ]
    },
    experience: {
      title: '经历',
      entries: [
        {
          period: '2024年6月 - 至今',
          company: '深圳市凡新科技有限公司',
          title: 'Java 后端开发工程师（云原生方向）',
          summary: '跨境 SaaS 团队，基于 AWS 提供订单与库存服务。',
          bullets: [
            '设计并维护 6 个 Spring Boot 微服务（AWS ECS Fargate），日处理 8万-15万 次请求，峰值超 1.2k QPS。',
            '使用 Terraform 和 AWS CDK 搭建 IaC，一键交付 Dev、Stage、Prod 环境 <20 分钟。',
            '借助 Lambda、SQS、Step Functions 重构库存批量同步流程，执行时间从约 25 分钟降至 7 分钟。',
            '引入 Redis Cluster 与 Aurora 只读副本，实现读写分离，缓存命中率约 96%，MTTR 缩短 45%。',
            '搭建 GitHub Actions + AWS CodePipeline CI/CD 流水线，结合 CloudWatch、Grafana、X-Ray 监控。'
          ]
        },
        {
          period: '2020年11月 - 2024年4月',
          company: '麦克尔斯（深圳）科技服务有限公司',
          title: '后端开发工程师',
          summary: '参与 Michaels.com 电商平台及 PLM、MakerPlace 模块建设。',
          bullets: [
            '在 GCP 上使用 Kubernetes 与 Docker 构建容器化部署并集成 CI/CD 自动化。',
            '负责 PLM 生命周期管理、供应商对接与分析看板，缺货率降低 15%。',
            '开发 MakerPlace 商家入驻、商品发布与订单管理，启用 JWT 轮换与 OAuth2 登录。',
            '优化 MongoDB 索引和 API 结构，接口吞吐提升约 30%。',
            '在 Scrum 团队中与前端、QA、DevOps 协作，支持高频发布。'
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
            '负责盖乐世空间 App 反馈模块开发与维护。',
            '实现三星账号 OAuth2 登录与 JWT 认证流程。',
            '接入百度统计和 Adobe Analytics 进行用户行为追踪。',
            '编写 Android UI 自动化测试脚本，提升回归效率。',
            '参与专利研讨和算法练习，采用敏捷模式协作。'
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
