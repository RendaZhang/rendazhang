import {
  HOME_PAGE_PATH,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH,
  PROFILE_PAGE_PATH
} from '../constants';

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
    closeMenu: 'Close navigation',
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
      dark: 'Switch to Dark Mode',
      paletteGroup: 'Theme color palette',
      palettes: {
        default: 'Switch to Default Palette',
        aurora: 'Switch to Aurora Palette',
        forest: 'Switch to Forest Palette'
      }
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
    closeMenu: '关闭导航',
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
      dark: '切换到深色模式',
      paletteGroup: '主题调色板',
      palettes: {
        default: '切换到默认调色板',
        aurora: '切换到极光调色板',
        forest: '切换到森林调色板'
      }
    }
  }
} as const;

export const NAVIGATION_ITEMS = [
  { href: HOME_PAGE_PATH, key: 'home', authenticatedOnly: false },
  { href: CHAT_PAGE_PATH, key: 'chat', authenticatedOnly: false },
  { href: CERTIFICATIONS_PAGE_PATH, key: 'certs', authenticatedOnly: false },
  { href: DOCS_PAGE_PATH, key: 'docs', authenticatedOnly: false },
  { href: PROFILE_PAGE_PATH, key: 'profile', authenticatedOnly: true }
] as const;

export function getNavigationItems(isLoggedIn: boolean) {
  return NAVIGATION_ITEMS.filter((item) => !item.authenticatedOnly || isLoggedIn);
}

export function getPrimaryNavigationItems(isLoggedIn: boolean) {
  return getNavigationItems(isLoggedIn).filter((item) => item.key !== 'home');
}
