export const CERTIFICATIONS_CONTENT = {
  en: {
    heading: 'Professional Certifications · Renda Zhang',
    summary:
      'This page uses public credentials as a compact learning and architecture signal. The AWS SAA certification supports my cloud-native positioning alongside PersonalWeb, production engineering experience, and technical documentation.',
    proofHeading: 'Architecture credibility signal',
    proofItems: [
      'Architecture fundamentals across compute, storage, networking, security, and managed services',
      'Reliability tradeoffs such as availability, fault isolation, cost awareness, and operational boundaries',
      'A shared cloud vocabulary for platform design, delivery reviews, and cross-functional decisions'
    ],
    boundary:
      'It is not presented as proof of owning a large AWS production estate by itself; it is one verifiable credential in a broader evidence chain.',
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
    heading: '专业证书 · 张人大',
    summary:
      '这个页面把公开证书作为学习能力与架构可信度的简洁证明。AWS SAA 证书与 PersonalWeb、生产工程经历和技术文档一起，支撑我的云原生工程定位。',
    proofHeading: '架构可信度信号',
    proofItems: [
      '覆盖计算、存储、网络、安全和托管服务的架构基础',
      '理解可用性、故障隔离、成本意识和运维边界等可靠性取舍',
      '为平台设计、交付评审和跨职能协作提供一致的云技术语言'
    ],
    boundary:
      '它不会被单独包装成拥有大型 AWS 生产体系的证明；它是更完整证据链中的一个可验证 credential。',
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
