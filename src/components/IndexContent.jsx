import React from 'react';
import ChatWidget from './ChatWidget.jsx';
import {
  SITE_BASE_URL,
  ABOUT_PAGE_PATH,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH,
  IMAGE_PATHS,
  SOCIAL_ICON_PATHS,
  SOCIAL_LINKS
} from '../config.js';
import { INDEX_CONTENT } from '../content/indexContent.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function IndexContent() {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  console.log('Current Language: ' + langKey);
  const textsEn = INDEX_CONTENT.en;
  const textsZh = INDEX_CONTENT.zh;

  return (
    <div className="container">
      <div className="about-section">
        <a href={ABOUT_PAGE_PATH} role="button" aria-label="About">
          <span className="lang-zh">{textsZh.aboutLink}</span>
          <span className="lang-en">{textsEn.aboutLink}</span>
        </a>
      </div>
      <div className="chat-section">
        <a href={CHAT_PAGE_PATH} role="button" aria-label="Chat with AI">
          <span className="lang-zh">{textsZh.chatLink}</span>
          <span className="lang-en">{textsEn.chatLink}</span>
        </a>
      </div>
      <div className="certification-section">
        <a href={CERTIFICATIONS_PAGE_PATH} role="button" aria-label="Certifications">
          <span className="lang-zh">{textsZh.certLink}</span>
          <span className="lang-en">{textsEn.certLink}</span>
        </a>
      </div>
      <div className="docs-section">
        <a href={DOCS_PAGE_PATH} role="button" aria-label="Tech Docs">
          <span className="code-icon">&lt;/&gt;</span>{' '}
          <span className="lang-zh">{textsZh.docsLink}</span>
          <span className="lang-en">{textsEn.docsLink}</span>
        </a>
      </div>
      <div className="social-icons" aria-label="Social Links">
        <a href={SITE_BASE_URL} aria-label="WeChat Official Account" id="wechatLink">
          <img
            src={IMAGE_PATHS.LOADER}
            className="jxLazyClass"
            jxLazyImg={SOCIAL_ICON_PATHS.WECHAT}
            alt="WeChat logo"
            loading="lazy"
          />
        </a>
        <a href={SOCIAL_LINKS.ZHIHU} aria-label="Zhihu">
          <img
            src={IMAGE_PATHS.LOADER}
            className="jxLazyClass"
            jxLazyImg={SOCIAL_ICON_PATHS.ZHIHU}
            alt="Zhihu logo"
            loading="lazy"
          />
        </a>
        <a href={SOCIAL_LINKS.TOUTIAO} aria-label="Toutiao">
          <img
            src={IMAGE_PATHS.LOADER}
            className="jxLazyClass"
            jxLazyImg={SOCIAL_ICON_PATHS.TOUTIAO}
            alt="Toutiao logo"
            loading="lazy"
          />
        </a>
        <a href={SOCIAL_LINKS.CSDN} aria-label="CSDN">
          <img
            src={IMAGE_PATHS.LOADER}
            className="jxLazyClass"
            jxLazyImg={SOCIAL_ICON_PATHS.CSDN}
            alt="CSDN logo"
            loading="lazy"
          />
        </a>
        <a href={SOCIAL_LINKS.MEDIUM} aria-label="Medium">
          <img
            src={IMAGE_PATHS.LOADER}
            className="jxLazyClass"
            jxLazyImg={SOCIAL_ICON_PATHS.MEDIUM}
            alt="Medium logo"
            loading="lazy"
          />
        </a>
      </div>
      <ChatWidget />
    </div>
  );
}
