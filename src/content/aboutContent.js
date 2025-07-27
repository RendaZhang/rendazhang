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
    }
  }
};
