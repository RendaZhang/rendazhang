import React from 'react';
import ContactForm from './ContactForm.jsx';
import { CONTACT_EMAIL_PRIMARY, CONTACT_PHONE_LOCAL } from '../config.js';
import { getLangContent } from '../utils/lang.js';

export default function ContactSection() {
  const langContent = getLangContent();
  const infos = langContent?.info || [];
  return (
    <section className="contact-section" id="contact">
      <h2 className="section-title">{langContent?.title || '联系我吧'}</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="contact-info mb-3">
            <strong>{infos[0]?.label || '手机'}</strong>
            <div>{infos[0]?.value || CONTACT_PHONE_LOCAL}</div>
          </div>
          <div className="contact-info mb-3">
            <strong>{infos[1]?.label || '邮箱'}</strong>
            <div>{infos[1]?.value || CONTACT_EMAIL_PRIMARY}</div>
          </div>
          <div className="contact-info">
            <strong>{infos[2]?.label || '地址'}</strong>
            <div>{infos[2]?.value || '广东省深圳市'}</div>
          </div>
        </div>
        <div className="col-md-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
