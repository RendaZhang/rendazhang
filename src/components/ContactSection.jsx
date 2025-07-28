import React from 'react';
import ContactForm from './ContactForm.jsx';
import { CONTACT_EMAIL_PRIMARY, CONTACT_PHONE_LOCAL } from '../config.js';
import { ABOUT_CONTENT } from '../content/aboutContent.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ContactSection() {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const contactZh = ABOUT_CONTENT.zh.contact;
  const contactEn = ABOUT_CONTENT.en.contact;
  const infosZh = contactZh.info || [];
  const infosEn = contactEn.info || [];
  const formTexts = langKey === 'zh' ? contactZh.form : contactEn.form;
  return (
    <section className="contact-section" id="contact">
      <h2 className="section-title">
        <span className="lang-zh">{contactZh.title}</span>
        <span className="lang-en">{contactEn.title}</span>
      </h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="contact-info mb-3">
            <strong>
              <span className="lang-zh">{infosZh[0]?.label}</span>
              <span className="lang-en">{infosEn[0]?.label}</span>
            </strong>
            <div>
              <span className="lang-zh">{infosZh[0]?.value || CONTACT_PHONE_LOCAL}</span>
              <span className="lang-en">{infosEn[0]?.value || CONTACT_PHONE_LOCAL}</span>
            </div>
          </div>
          <div className="contact-info mb-3">
            <strong>
              <span className="lang-zh">{infosZh[1]?.label}</span>
              <span className="lang-en">{infosEn[1]?.label}</span>
            </strong>
            <div>
              <span className="lang-zh">{infosZh[1]?.value || CONTACT_EMAIL_PRIMARY}</span>
              <span className="lang-en">{infosEn[1]?.value || CONTACT_EMAIL_PRIMARY}</span>
            </div>
          </div>
          <div className="contact-info">
            <strong>
              <span className="lang-zh">{infosZh[2]?.label}</span>
              <span className="lang-en">{infosEn[2]?.label}</span>
            </strong>
            <div>
              <span className="lang-zh">{infosZh[2]?.value || '广东省深圳市'}</span>
              <span className="lang-en">{infosEn[2]?.value || 'Shenzhen, Guangdong, China'}</span>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <ContactForm texts={formTexts} />
        </div>
      </div>
    </section>
  );
}
