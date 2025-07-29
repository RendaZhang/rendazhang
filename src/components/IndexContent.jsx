import React, { useState, useRef, useEffect } from 'react';
import ChatWidget from './ChatWidget.jsx';
import {
  SITE_BASE_URL,
  ABOUT_PAGE_PATH,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH,
  SOCIAL_ICON_PATHS,
  SOCIAL_LINKS
} from '../config.js';
import { INDEX_CONTENT } from '../content/indexContent.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LocalizedSection from './LocalizedSection.jsx';

function SocialIcon({ href, id, src, alt, ariaLabel }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <a href={href} aria-label={ariaLabel} id={id}>
      {!loaded && <span className="spinner" aria-hidden="true" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className={loaded ? 'loaded' : 'loading'}
        onLoad={() => setLoaded(true)}
      />
    </a>
  );
}

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
          <LocalizedSection zhContent={textsZh.aboutLink} enContent={textsEn.aboutLink} />
        </a>
      </div>
      <div className="chat-section">
        <a href={CHAT_PAGE_PATH} role="button" aria-label="Chat with AI">
          <LocalizedSection zhContent={textsZh.chatLink} enContent={textsEn.chatLink} />
        </a>
      </div>
      <div className="certification-section">
        <a href={CERTIFICATIONS_PAGE_PATH} role="button" aria-label="Certifications">
          <LocalizedSection zhContent={textsZh.certLink} enContent={textsEn.certLink} />
        </a>
      </div>
      <div className="docs-section">
        <a href={DOCS_PAGE_PATH} role="button" aria-label="Tech Docs">
          <span className="code-icon">&lt;/&gt;</span>{' '}
          <LocalizedSection zhContent={textsZh.docsLink} enContent={textsEn.docsLink} />
        </a>
      </div>
      <div className="social-icons" aria-label="Social Links">
        <SocialIcon
          href={SITE_BASE_URL}
          ariaLabel="WeChat Official Account"
          id="wechatLink"
          src={SOCIAL_ICON_PATHS.WECHAT}
          alt="WeChat logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.ZHIHU}
          ariaLabel="Zhihu"
          src={SOCIAL_ICON_PATHS.ZHIHU}
          alt="Zhihu logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.TOUTIAO}
          ariaLabel="Toutiao"
          src={SOCIAL_ICON_PATHS.TOUTIAO}
          alt="Toutiao logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.CSDN}
          ariaLabel="CSDN"
          src={SOCIAL_ICON_PATHS.CSDN}
          alt="CSDN logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.MEDIUM}
          ariaLabel="Medium"
          src={SOCIAL_ICON_PATHS.MEDIUM}
          alt="Medium logo"
        />
      </div>
      <ChatWidget />
    </div>
  );
}
