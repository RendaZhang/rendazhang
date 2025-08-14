export const NAV_CONTENT = {
  en: {
    home: 'Home',
    loggedIn: 'Logged In', // text shown on home link when user is authenticated
    login: 'Login',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    cancel: 'Cancel',
    register: 'Register',
    menu: 'Menu',
    profile: 'Account Profile',
    drawer: {
      home: 'Home',
      chat: 'AI Chat',
      certs: 'Certifications',
      docs: 'Tech Docs',
      profile: 'Account Profile'
    },
    theme: {
      button: 'Theme',
      light: 'Switch to Light Mode',
      dark: 'Switch to Dark Mode'
    }
  },
  zh: {
    home: '首页',
    loggedIn: '已登录', // 登录后首页链接显示的提示文字
    login: '登录',
    logout: '退出',
    logoutConfirm: '确定要退出登录吗？',
    cancel: '取消',
    register: '注册',
    menu: '菜单',
    profile: '账号信息',
    drawer: {
      home: '首页',
      chat: 'AI 聊天',
      certs: '证书',
      docs: '技术文档',
      profile: '账号信息'
    },
    theme: {
      button: '切换主题',
      light: '切换到浅色模式',
      dark: '切换到深色模式'
    }
  }
} as const;
