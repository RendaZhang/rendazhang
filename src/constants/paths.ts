import aboutCssUrl from '../styles/components/about.css?url';
import deepseekChatCssUrl from '../styles/components/deepseek_chat.css?url';
import certificationsCssUrl from '../styles/components/certifications.css?url';
import docsCssUrl from '../styles/components/docs.css?url';
import responsiveHeroCssUrl from '../styles/components/responsive-hero.css?url';
import socialIconsCssUrl from '../styles/components/social-icons.css?url';
import chatWidgetCssUrl from '../styles/components/chat_widget.css?url';
import markdownDarkModeCssUrl from '../styles/components/markdown-dark-mode.css?url';
import githubCodeHighlightCssUrl from '../styles/components/github-code-highlight.css?url';
import githubMarkdownLightCssUrl from '../styles/components/github-markdown-light.css?url';
import faviconPngUrl from '../assets/favicons/favicon.png?url';
import faviconIcoUrl from '../assets/favicons/favicon.ico?url';
import favicon16Url from '../assets/favicons/favicon-16x16.png?url';
import resumeEnUrl from '../assets/Resume_RendaZhang.pdf?url';
import resumeZhUrl from '../assets/个人简历_张人大.pdf?url';
import coverCertificationsUrl from '../assets/cover-certifications-high-rectangle-1200x630.jpg?url';
import wechatQrUrl from '../assets/qrcode-wechat-medium-square-258x258.jpg?url';
import logoV4Url from '../assets/logo-v4-high-circle-300x300.png?url';
import readmeZh from '../assets/README.md?raw';
import readmeEn from '../assets/README_EN.md?raw';
import wechatLogo from '../assets/social/wechat-logo.svg';
import zhihuLogo from '../assets/social/zhihu-logo.svg';
import toutiaoLogo from '../assets/social/toutiao-logo.svg';
import csdnLogo from '../assets/social/csdn-logo.svg';
import mediumLogo from '../assets/social/medium-logo.svg';

export { HERO_IMAGE_PATHS } from '../utils/heroImages';

export const CHAT_PAGE_PATH = '/deepseek_chat';
export const ABOUT_PAGE_PATH = '/';
export const CERTIFICATIONS_PAGE_PATH = '/certifications';
export const DOCS_PAGE_PATH = '/docs';
export const LOGIN_PAGE_PATH = '/login';
export const REGISTER_PAGE_PATH = '/register';
export const FORGOT_PASSWORD_PAGE_PATH = '/forgot_password';
export const RESET_PASSWORD_PAGE_PATH = '/reset_password';
export const PROFILE_PAGE_PATH = '/profile';
export const HOME_PAGE_PATH = '/';

export const DOC_CONTENT = {
  README_ZH: readmeZh,
  README_EN: readmeEn
} as const;

export const STYLE_PATHS = {
  ABOUT: aboutCssUrl,
  DEEPSEEK_CHAT: deepseekChatCssUrl,
  CERTIFICATIONS: certificationsCssUrl,
  DOCS: docsCssUrl,
  RESPONSIVE_HERO: responsiveHeroCssUrl,
  SOCIAL_ICON: socialIconsCssUrl,
  CHAT_WIDGET: chatWidgetCssUrl,
  MARKDOWN_DARK_MODE: markdownDarkModeCssUrl,
  GITHUB_CODE_HIGHLIGHT: githubCodeHighlightCssUrl,
  GITHUB_MARKDOWN_LIGHT: githubMarkdownLightCssUrl
} as const;

export const FAVICON_PATHS = {
  ICO: faviconIcoUrl,
  PNG: faviconPngUrl,
  SMALL: favicon16Url
} as const;

export const FAVICON_PATH = FAVICON_PATHS.PNG;

export const IMAGE_PATHS = {
  WECHAT_QR: wechatQrUrl,
  CERTIFICATIONS_COVER: coverCertificationsUrl,
  RESUME_EN: resumeEnUrl,
  RESUME_ZH: resumeZhUrl,
  LOGO_V4: logoV4Url
} as const;

export const SOCIAL_ICON_PATHS = {
  WECHAT: wechatLogo,
  ZHIHU: zhihuLogo,
  TOUTIAO: toutiaoLogo,
  CSDN: csdnLogo,
  MEDIUM: mediumLogo
} as const;

export const RESUME_EN_DOWNLOAD = 'Resume_RendaZhang_20250922.pdf';
export const RESUME_ZH_DOWNLOAD = '个人简历_张人大_20250922.pdf';
