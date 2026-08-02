export const DEEPSEEK_CHAT_CONTENT = {
  en: {
    title: 'AI Chat',
    description: 'Chat with an AI assistant powered by DeepSeek.',
    loading: 'Loading conversation...',
    coreLoadFailed: 'Failed to load core resources. Please refresh.',
    enhancementProgress: 'Enhancing readability...',
    enhancementFailed: 'Enhancement failed, basic features unaffected',
    placeholders: {
      loading: 'Loading conversation, please wait...',
      error: 'Core resources failed to load',
      default: 'Enter message...'
    },
    presets: {
      heading: 'Ask about Renda and PersonalWeb',
      description:
        'Choose a question to send it now, or write your own. Guided answers use only public information.',
      questions: {
        who_is_renda: 'Who is Renda Zhang?',
        personalweb_proof: 'What did Renda build in PersonalWeb?',
        cloud_native_evidence: "Where can I see Renda's cloud-native work?",
        certification_context: "What does Renda's AWS certification cover?",
        recruiter_summary: 'What should a recruiter look at first?'
      }
    },
    sourceHints: {
      heading: 'Where to verify',
      ariaLabel: 'Public pages that support this guided answer'
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
    coreLoadFailed: '核心资源加载失败，请刷新尝试',
    enhancementProgress: '正在优化阅读体验...',
    enhancementFailed: '优化功能加载失败，基础功能不受影响',
    placeholders: {
      loading: '加载对话中，请稍候...',
      error: '核心资源加载失败',
      default: '输入消息...'
    },
    presets: {
      heading: '了解 Renda 和 PersonalWeb',
      description: '点击问题即可发送，也可以直接输入。导览回答只使用公开信息。',
      questions: {
        who_is_renda: 'Renda Zhang 是谁？',
        personalweb_proof: 'Renda 在 PersonalWeb 里做了什么？',
        cloud_native_evidence: '从哪里能看到 Renda 的云原生经验？',
        certification_context: 'Renda 的 AWS 认证涵盖什么？',
        recruiter_summary: '招聘方可以先看哪些内容？'
      }
    },
    sourceHints: {
      heading: '可核对的页面',
      ariaLabel: '用于支持此导览回答的公开页面'
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
