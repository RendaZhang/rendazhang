import React, { useState } from 'react';
import { CONTACT_FORM_ENDPOINT } from '../config.js';

function getFormTexts() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return {};
  }
  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const content = window.aboutPageContent || {};
  return (content[lang] && content[lang].contact && content[lang].contact.form) || {};
}

export default function ContactForm() {
  const texts = getFormTexts();
  const initialForm = {
    name: '',
    contact: '',
    _subject: '',
    message: ''
  };
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form._subject || !form.message) {
      setError(texts.errorEmpty || '请填写所有字段');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const body = new URLSearchParams(form).toString();
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('success');
        setForm(initialForm);
      } else {
        setStatus('error');
        setError(texts.failed || '发送失败');
      }
    } catch {
      setStatus('error');
      setError(texts.failed || '发送失败');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="mb-3">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder={texts.placeholders?.name || '你的名字'}
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="contact"
          className="form-control"
          placeholder={texts.placeholders?.contact || '你的联系方式'}
          value={form.contact}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="_subject"
          className="form-control"
          placeholder={texts.placeholders?.subject || '主题'}
          value={form._subject}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          name="message"
          className="form-control"
          rows="5"
          placeholder={texts.placeholders?.message || '内容描述'}
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? texts.sending || '发送中...' : texts.button || '发送消息'}
      </button>
      {status === 'success' && (
        <div className="form-message success mt-2">{texts.success || '已经发送到我的邮箱哦'}</div>
      )}
      {status === 'error' && error && <div className="form-message error mt-2">{error}</div>}
    </form>
  );
}
