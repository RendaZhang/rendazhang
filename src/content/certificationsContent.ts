export const CERTIFICATIONS_CONTENT = {
  en: {
    heading: 'AWS Certification · Renda Zhang',
    summary:
      'This page records my AWS Certified Solutions Architect - Associate (SAA-C03) certification. Its issue and expiry dates, Credly badge, and official verification links are available below.',
    coverageHeading: 'What this certification covers',
    coverageItems: [
      'Designing AWS solutions across compute, storage, networking, security, and managed services',
      'Evaluating availability, fault isolation, cost, and operational boundaries',
      'Using a shared architecture vocabulary in design and delivery reviews'
    ],
    boundary:
      'The certification supports my architecture foundation. It does not by itself demonstrate production scale, traffic, or customer impact.',
    certificates: [
      {
        title: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
        nameLabel: 'Name:',
        name: 'Renda Zhang',
        issuedLabel: 'Issued:',
        issued: '2025-06-16',
        expiresLabel: 'Expires:',
        expires: '2028-06-16',
        verifyCredly: 'Verify on Credly',
        verifyAws: 'Verify on AWS'
      }
    ]
  },
  zh: {
    heading: 'AWS 认证 · 张人大',
    summary:
      '这里记录了我的 AWS Certified Solutions Architect - Associate (SAA-C03) 认证。证书的颁发与到期日期、Credly 徽章和官方验证入口都列在下方。',
    coverageHeading: '这项认证覆盖什么',
    coverageItems: [
      '围绕计算、存储、网络、安全和托管服务设计 AWS 解决方案',
      '评估可用性、故障隔离、成本与运维边界',
      '在方案设计和交付评审中使用一致的云架构语言'
    ],
    boundary: '这项认证支撑我的架构基础，但不能单独说明生产规模、流量或客户影响。',
    certificates: [
      {
        title: 'AWS 认证解决方案架构师 - 助理级 (SAA-C03)',
        nameLabel: '姓名:',
        name: '张人大',
        issuedLabel: '颁发:',
        issued: '2025 年 6 月 16 日',
        expiresLabel: '到期:',
        expires: '2028 年 6 月 16 日',
        verifyCredly: 'Credly 验证',
        verifyAws: 'AWS 验证'
      }
    ]
  }
} as const;
