export const DEEPSEEK_CHAT_CONTENT = {
  en: {
    title: 'AI Chat',
    description: 'Chat with an AI assistant powered by DeepSeek.',
    loading: 'Loading conversation...',
    chatReady: 'Conversation ready. Type a message to start.',
    coreLoadFailed: 'Failed to load core resources. Please refresh.',
    enhancementProgress: 'Enhancing readability...',
    enhancementFailed: 'Enhancement failed, basic features unaffected',
    placeholders: {
      loading: 'Loading conversation, please wait...',
      error: 'Core resources failed to load',
      default: 'Enter message...'
    },
    presets: {
      heading: 'Start with a public proof question',
      description: 'Choose a short question; public site context is applied when you send.',
      questions: {
        who_is_renda: 'Who is Renda Zhang?',
        personalweb_proof: 'What does PersonalWeb prove?',
        cloud_native_evidence:
          'What public evidence supports cloud-native engineering credibility?',
        certification_context: 'How does the AWS certification support the site credibility?',
        recruiter_summary: 'How should a recruiter evaluate this site quickly?'
      }
    },
    resetConfirm: 'Are you sure you want to reset the conversation? This will clear all history.',
    resetFailedPrefix: 'Reset failed',
    sendButton: 'Send',
    resetButton: 'Reset',
    confirmButton: 'OK',
    cancelButton: 'Cancel',
    copyLabel: 'Copy',
    copiedLabel: 'Copied'
  },
  zh: {
    title: 'AI 对话',
    description: '由 DeepSeek 提供支持的 AI 助手',
    loading: '加载对话中...',
    chatReady: '会话已准备，请输入消息开始对话',
    coreLoadFailed: '核心资源加载失败，请刷新尝试',
    enhancementProgress: '正在优化阅读体验...',
    enhancementFailed: '优化功能加载失败，基础功能不受影响',
    placeholders: {
      loading: '加载对话中，请稍候...',
      error: '核心资源加载失败',
      default: '输入消息...'
    },
    presets: {
      heading: '从公开证明问题开始',
      description: '选择一个短问题，发送时会自动应用公开网站上下文。',
      questions: {
        who_is_renda: 'Renda Zhang 是谁？',
        personalweb_proof: 'PersonalWeb 证明了什么？',
        cloud_native_evidence: '哪些公开证据支持云原生工程可信度？',
        certification_context: 'AWS 认证如何支持这个网站的可信度？',
        recruiter_summary: '招聘方应该如何快速评估这个网站？'
      }
    },
    resetConfirm: '确定要重置会话吗？将清除所有历史记录。',
    resetFailedPrefix: '重置失败',
    sendButton: '发送',
    resetButton: '重置会话',
    confirmButton: '确定',
    cancelButton: '取消',
    copyLabel: '复制',
    copiedLabel: '已复制'
  }
} as const;
