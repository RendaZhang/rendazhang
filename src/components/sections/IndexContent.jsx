import React from 'react';
import { ChatWidget } from '../chat';
import {
  ABOUT_PAGE_PATH,
  CHAT_PAGE_PATH,
  CERTIFICATIONS_PAGE_PATH,
  DOCS_PAGE_PATH
} from '../../config.js';
import { INDEX_CONTENT } from '../../content';
import { useLanguage } from '../providers';
import { LocalizedSection } from '../ui';

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
      <ChatWidget />
    </div>
  );
}
