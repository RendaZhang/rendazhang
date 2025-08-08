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
        { label: 'Java Backend Development', level: 98 },
        { label: 'Spring Boot / Cloud', level: 98 },
        { label: 'Middleware & Caching', level: 90 },
        { label: 'Database Technologies', level: 95 },
        { label: 'Microservices & Security', level: 92 },
        { label: 'DevOps & Deployment Tools', level: 90 },
        { label: 'Frontend Collaboration', level: 75 },
        { label: 'Development Tools & Platforms', level: 90 }
      ],
      items: [
        'Java, Python, SQL, HTML/CSS, JavaScript, Vue.js',
        'Spring Boot, Spring Cloud, MyBatis, JPA, Feign',
        'Redis, MongoDB, MySQL, ElasticSearch',
        'RabbitMQ, Kafka, FastDFS, Eureka, Gateway',
        'JWT, OAuth2, Load Balancing, Circuit Breaking',
        'Docker, Docker Compose, Git, Linux Shell',
        'Jenkins, GitLab CI/CD, Postman, OpenAPI/Swagger',
        'RESTful API Design & System Architecture',
        'Agile Development & Cross-team Collaboration',
        'English (Professional Working Proficiency)',
        'Chinese (Mandarin & Cantonese)'
      ]
    },
    experience: {
      title: 'Experience',
      entries: [
        {
          period: 'Nov 2020 - Apr 2024',
          company: 'Michaels (Shenzhen)',
          title: 'Backend Engineer - PLM Project',
          summary:
            'Spearheaded product onboarding, lifecycle tracking, and supplier integration on the Michaels e-commerce platform.',
          bullets: [
            'Built product lifecycle tracking system: introduction → growth → maturity → decline.',
            'Reduced stockout rate by 15% via inventory tracking + restock alert features.',
            'Integrated APIs with suppliers for real-time product & inventory sync.',
            'Developed analytics dashboards to visualize product performance & trends.',
            'Worked cross-functionally with sales, marketing, and supply chain teams.'
          ]
        },
        {
          period: 'Nov 2020 - Apr 2024',
          company: 'Michaels (Shenzhen)',
          title: 'Backend Engineer - MakerPlace Project',
          summary:
            'Led the backend development of MakerPlace, a platform for artisan e-commerce, growing user base by 200% in the first year.',
          bullets: [
            'Implemented seller onboarding, product listing, and order management modules.',
            'Enabled JWT token rotation and migrated auth to asymmetric encryption.',
            'Optimized MongoDB indexes to improve query performance by 30%.',
            'Collaborated with DevOps and QA teams; mentored junior engineers.'
          ]
        },
        {
          period: 'May 2018 - Jun 2019',
          company: 'Samsung R&D - Guangzhou',
          title: 'Software Engineer - Android Application',
          bullets: [
            'Developed Android feedback modules and supported app integration projects.',
            'Handled JWT cross-domain auth and Samsung OAuth2 login flows.',
            'Embedded analytics via Baidu & Adobe tracking systems.',
            'Used Agile, Git, and Gerrit for version control and external code reviews.',
            'Participated in patent application discussions and algorithm tests.'
          ]
        },
        {
          period: '2019 - 2020',
          company: 'Private Tutoring',
          title: 'English Tutor (Part-time)',
          summary:
            "Delivered customized English lessons, improved students' written and oral proficiency, and managed schedules for multiple learners."
        },
        {
          period: 'Fall 2014',
          company: 'UMN - Crookston',
          title: 'Math Tutor',
          summary:
            'Provided college-level tutoring in advanced math topics; enhanced student comprehension and academic performance.'
        },
        {
          period: '2014',
          company: 'Lee Academy',
          title: 'Facility Cleaner',
          summary:
            'Maintained indoor cleanliness and landscaped school grounds at Lee Academy in Maine.'
        },
        {
          period: '2012 - 2013',
          company: 'Lee Academy',
          title: 'Cross-Country Runner',
          summary:
            'Participated in school competitions and training; demonstrated endurance and team collaboration.'
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
        { label: 'Java 后端技术', level: 98 },
        { label: 'Spring Boot / Cloud', level: 98 },
        { label: '中间件与缓存', level: 90 },
        { label: '数据库技术', level: 95 },
        { label: '微服务架构与安全', level: 92 },
        { label: '运维与部署工具', level: 90 },
        { label: '前端与协作开发', level: 75 },
        { label: '开发工具与平台', level: 90 }
      ],
      items: [
        'Java、Python、SQL、HTML/CSS、JavaScript、Vue.js',
        'Spring Boot、Spring Cloud、MyBatis、JPA、Feign',
        'Redis、MongoDB、MySQL、ElasticSearch',
        'RabbitMQ、Kafka、FastDFS、Eureka、Gateway',
        'JWT、OAuth2、负载均衡、熔断',
        'Docker、Docker Compose、Git、Linux Shell',
        'Jenkins、GitLab CI/CD、Postman、OpenAPI/Swagger',
        'RESTful API 设计与系统架构',
        '敏捷开发与跨团队协作',
        '英语（专业工作水平）',
        '中文（普通话和粤语）'
      ]
    },
    experience: {
      title: '经历',
      entries: [
        {
          period: '2020年11月 - 2024年4月',
          company: 'Michaels（深圳）',
          title: '后端工程师 - PLM 项目',
          summary: '负责在 Michaels 电商平台上推进产品上线、生命周期追踪及供应商集成。',
          bullets: [
            '构建产品生命周期追踪系统：引入 → 成长期 → 成熟期 → 衰退期。',
            '通过库存追踪和补货提醒将缺货率降低 15%。',
            '与供应商 API 对接，实现产品和库存的实时同步。',
            '开发分析看板，展示产品表现及趋势。',
            '与销售、市场和供应链团队跨部门合作。'
          ]
        },
        {
          period: '2020年11月 - 2024年4月',
          company: 'Michaels（深圳）',
          title: '后端工程师 - MakerPlace 项目',
          summary: '主导 MakerPlace 手工艺电商平台后台开发，第一年用户增长 200%。',
          bullets: [
            '实现商家入驻、商品发布及订单管理模块。',
            '启用 JWT 令牌轮换，迁移认证至非对称加密。',
            '优化 MongoDB 索引，查询性能提升 30%。',
            '与 DevOps、QA 团队协作并指导初级工程师。'
          ]
        },
        {
          period: '2018年5月 - 2019年6月',
          company: '三星广州研究所',
          title: '软件工程师 - Android 应用',
          bullets: [
            '开发 Android 反馈模块并支持应用集成项目。',
            '处理 JWT 跨域认证及三星 OAuth2 登录流程。',
            '接入百度与 Adobe 数据统计。',
            '使用敏捷流程、Git 和 Gerrit 进行代码管理及评审。',
            '参与专利申请讨论和算法测试。'
          ]
        },
        {
          period: '2019 - 2020年',
          company: '私人家教',
          title: '兼职英语教师',
          summary: '为多名学生定制英语课程，提升听说读写能力并安排学习计划。'
        },
        {
          period: '2014年秋',
          company: '明尼苏达大学 Crookston 分校',
          title: '数学助教',
          summary: '提供大学高等数学辅导，帮助学生提升理解和成绩。'
        },
        {
          period: '2014年',
          company: 'Lee Academy',
          title: '校园保洁员',
          summary: '维护校舍清洁并整理校园环境。'
        },
        {
          period: '2012 - 2013年',
          company: 'Lee Academy',
          title: '越野跑队员',
          summary: '参与校内比赛与训练，展现耐力与团队协作。'
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
