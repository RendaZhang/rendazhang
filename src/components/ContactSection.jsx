import React from 'react';
import ContactForm from './ContactForm.jsx';
import { CONTACT_EMAIL_PRIMARY, CONTACT_PHONE_LOCAL } from '../config.js';

export default function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <h2 className="section-title">联系我吧</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="contact-info mb-3">
            <strong>手机</strong>
            <div>{CONTACT_PHONE_LOCAL}</div>
          </div>
          <div className="contact-info mb-3">
            <strong>邮箱</strong>
            <div>{CONTACT_EMAIL_PRIMARY}</div>
          </div>
          <div className="contact-info">
            <strong>地址</strong>
            <div>广东省深圳市</div>
          </div>
        </div>
        <div className="col-md-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
