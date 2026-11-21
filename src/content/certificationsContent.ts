import { AWS_SAA_CREDENTIAL_SCHEMA, PERSON_SCHEMA } from '../constants/meta';

const EXAM_GUIDE =
  'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03';

function chineseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export const CERTIFICATION_DATES = {
  issued: AWS_SAA_CREDENTIAL_SCHEMA.datePublished,
  expires: AWS_SAA_CREDENTIAL_SCHEMA.expires
} as const;

export const CERTIFICATION_TOPICS = [
  {
    title: { zh: '可用性', en: 'Availability' },
    description: {
      zh: '比较跨可用区部署、负载均衡和故障转移，判断一个可用区中断后如何继续接住流量。',
      en: 'Compare deployment across Availability Zones, load balancing, and failover to keep serving traffic when a zone goes down.'
    },
    source: `${EXAM_GUIDE}/solutions-architect-associate-03-domain2.html`
  },
  {
    title: { zh: '故障隔离', en: 'Fault isolation' },
    description: {
      zh: '用队列和松耦合划分组件边界，尽量把单个组件的故障限制在局部。',
      en: 'Use queues and loosely coupled components to limit how far a failure can spread.'
    },
    source: `${EXAM_GUIDE}/solutions-architect-associate-03-domain2.html`
  },
  {
    title: { zh: '成本', en: 'Cost' },
    description: {
      zh: '按负载定计算资源的规格和伸缩方式，按访问频率和保留期选择存储层级。',
      en: 'Size compute for the workload and choose storage tiers according to access frequency and retention needs.'
    },
    source: `${EXAM_GUIDE}/solutions-architect-associate-03-domain4.html`
  }
] as const;

export const CERTIFICATIONS_CONTENT = {
  en: {
    heading: 'AWS Certification · Renda Zhang',
    coverageHeading: 'What this certification covers',
    guideLink: 'AWS exam guide',
    architecture: 'Reference Architecture',
    chat: 'Ask about this certificate',
    certificate: {
      title: AWS_SAA_CREDENTIAL_SCHEMA.name,
      nameLabel: 'Holder',
      name: PERSON_SCHEMA.name,
      issuedLabel: 'Issued',
      issued: CERTIFICATION_DATES.issued,
      expiresLabel: 'Expires',
      expires: CERTIFICATION_DATES.expires,
      verifyCredly: 'Verify on Credly',
      verifyAws: 'Verify on AWS'
    }
  },
  zh: {
    heading: 'AWS 认证 · 张人大',
    coverageHeading: '这项认证覆盖什么',
    guideLink: 'AWS 考试指南',
    architecture: '参考架构',
    chat: '问这张证书',
    certificate: {
      title: 'AWS 认证解决方案架构师 - 助理级 (SAA-C03)',
      nameLabel: '持有人',
      name: '张人大',
      issuedLabel: '颁发',
      issued: chineseDate(CERTIFICATION_DATES.issued),
      expiresLabel: '到期',
      expires: chineseDate(CERTIFICATION_DATES.expires),
      verifyCredly: 'Credly 验证',
      verifyAws: 'AWS 验证'
    }
  }
} as const;
