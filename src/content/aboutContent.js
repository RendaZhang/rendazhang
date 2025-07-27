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
      'I specialize in Java backend development, with 5 years of experience building robust and scalable systems using Spring Boot, Spring Cloud, and microservice architectures.',
      "I hold a B.S. degree in Computer Science from the University of Minnesota - Twin Cities, and I'm fluent in both English and Mandarin with international study and work experience.",
      "I'm passionate about solving real-world problems through clean architecture, efficient data design, and backend system optimization. I've led multiple full-lifecycle backend projects involving high concurrency, distributed systems, and team collaboration across departments.",
      "I'm currently seeking new opportunities where I can make impactful contributions and continue growing as an engineer."
    ],
    info: [
      { label: 'Name:', value: ' Renda Zhang' },
      {
        label: 'Email:',
        value: ` <a href="mailto:${CONTACT_EMAIL_PRIMARY}">${CONTACT_EMAIL_PRIMARY}</a>`
      },
      { label: 'Phone:', value: ` ${CONTACT_PHONE_INTL}` },
      { label: 'Address:', value: ' Shenzhen, Guangdong, China' },
      { label: 'Status:', value: ' Actively open to work' }
    ],
    resumeLabel: 'Download Resume'
  },
  zh: {
    heroHeading: '大家好，我是<span>张人大</span>',
    heroTaglines: ['软件工程师', '后端开发者', '前端开发者', 'Android 开发者', 'Web 开发者'],
    subTitle: '我是谁？',
    title: '自我介绍',
    greeting: '你好，',
    paragraphs: [
      '我是张人大，5 年 Java 后端工程经验，主导建设面向 C 端的电商平台（如 Michaels、MakerPlace）， 熟练运用微服务架构、Kubernetes 容器化部署与 CI/CD 流水线，专注于高并发系统性能优化，具备跨国团队协作能力。欢迎访问我的简历和项目介绍。'
    ],
    info: [
      { label: '名字:', value: ' 张人大' },
      { label: '生日:', value: '1995年11月5日' },
      { label: '电话:', value: ` ${CONTACT_PHONE_LOCAL}` },
      { label: '邮箱:', value: ` ${CONTACT_EMAIL_PRIMARY}` }
    ],
    resumeLabel: '下载我的简历',
    contactLabel: '欢迎随时联系我'
  }
};
