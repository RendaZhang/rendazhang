import { CONTACT_EMAIL_PRIMARY, CONTACT_PHONE_INTL, CONTACT_PHONE_LOCAL } from '../config.js';

export const ABOUT_CONTENT = {
  en: {
    heroHeading: 'Hello ! I am<span> Renda Zhang</span>',
    heroTaglines: [
      'Software Engineer',
      'Backend Developer',
      'Frontend Developer',
      'Android Developer',
      'Web Developer'
    ],
    subTitle: 'Who am I?',
    title: 'About Me',
    paragraphs: [
      "Hello! I'm Renda Zhang, a software engineer based in Shenzhen, China.",
      'I specialize in Java backend development with 5 years of experience building robust and scalable systems. I have led consumer e-commerce projects such as Michaels and MakerPlace using Spring Boot and Spring Cloud microservice architectures.',
      "I'm proficient in Kubernetes containerization, CI/CD pipelines and high-concurrency performance optimization, and have collaborated with distributed teams across countries.",
      "I hold a B.S. degree in Computer Science from the University of Minnesota - Twin Cities, and I'm fluent in both English and Mandarin with international study and work experience.",
      "I'm passionate about solving real-world problems through clean architecture and efficient data design. I'm currently seeking new opportunities where I can make impactful contributions and continue growing as an engineer. Feel free to explore my resume and project portfolio."
    ],
    info: [
      { label: 'Name:', value: ' Renda Zhang' },
      { label: 'Birthday:', value: ' Nov 5, 1995' },
      { label: 'Email:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: 'Phone:', value: ` ${CONTACT_PHONE_INTL}` },
      { label: 'Address:', value: ' Shenzhen, Guangdong, China' },
      { label: 'Status:', value: ' Actively open to work' }
    ],
    resumeLabel: 'Download Resume',
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
    }
  },
  zh: {
    heroHeading: '大家好，我是<span>张人大</span>',
    heroTaglines: ['软件工程师', '后端开发者', '前端开发者', 'Android 开发者', 'Web 开发者'],
    subTitle: '我是谁？',
    title: '自我介绍',
    greeting: '你好，',
    paragraphs: [
      '大家好，我是张人大，现居中国深圳的软件工程师。',
      '拥有 5 年 Java 后端开发经验，曾主导建设面向 C 端的电商平台（如 Michaels、MakerPlace），熟练运用 Spring Boot、Spring Cloud 等微服务架构。',
      '擅长 Kubernetes 容器化部署和 CI/CD 流水线，专注于高并发系统性能优化，并具备跨国团队协作能力。',
      '毕业于美国明尼苏达大学双城分校计算机科学专业，能熟练使用英文和普通话交流，拥有国际学习和工作经历。',
      '热衷于通过整洁架构和高效数据设计解决实际问题，目前正寻找能够持续成长并发挥影响力的机会，欢迎访问我的简历和项目介绍。'
    ],
    info: [
      { label: '名字:', value: ' 张人大' },
      { label: '生日:', value: '1995年11月5日' },
      { label: '电话:', value: ` ${CONTACT_PHONE_LOCAL}` },
      { label: '邮箱:', value: ` ${CONTACT_EMAIL_PRIMARY}` },
      { label: '地址:', value: ' 中国广东省深圳市' },
      { label: '求职状态:', value: ' 积极寻找工作机会' }
    ],
    resumeLabel: '下载我的简历',
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
    }
  }
};
