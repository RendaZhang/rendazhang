import {
  HOME_PAGE_PATH,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH,
  LOGIN_PAGE_PATH,
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
    profile: 'Account',
    drawer: {
      home: 'Home',
      chat: 'AI Chat',
      certs: 'Certifications',
      docs: 'Docs',
      profile: 'Account'
    },
    theme: {
      button: 'Theme',
      light: 'Switch to Light Mode',
      dark: 'Switch to Dark Mode',
      paletteGroup: 'Theme color palette',
      palettes: {
        default: 'Ink And Vermilion',
        aurora: 'Silver And Cobalt',
        forest: 'Graphite And Pine'
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
    profile: '账号',
    drawer: {
      home: '首页',
      chat: 'AI 聊天',
      certs: '证书',
      docs: '文档',
      profile: '账号'
    },
    theme: {
      button: '切换主题',
      light: '切换到浅色模式',
      dark: '切换到深色模式',
      paletteGroup: '主题调色板',
      palettes: {
        default: '墨与朱',
        aurora: '银与钴蓝',
        forest: '石墨与松绿'
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

export type NavigationRoute = (typeof NAVIGATION_ITEMS)[number]['key'] | 'login';

export function getCurrentNavigationRoute(pathname: string): NavigationRoute | undefined {
  const path = pathname.replace(/\/+$/, '') || HOME_PAGE_PATH;
  return path === LOGIN_PAGE_PATH
    ? 'login'
    : NAVIGATION_ITEMS.find((item) => item.href === path)?.key;
}

export function getNavigationItems(isLoggedIn: boolean) {
  return NAVIGATION_ITEMS.filter((item) => !item.authenticatedOnly || isLoggedIn);
}

export function getPrimaryNavigationItems(isLoggedIn: boolean) {
  return getNavigationItems(isLoggedIn).filter((item) => item.key !== 'home');
}
