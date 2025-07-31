import { useState, useEffect } from 'react';
import { CONTACT_FORM_ENDPOINT } from '../../../config.js';
import { useLanguage } from '../../providers';
import { LocalizedSection } from '../../ui';

export default function ContactForm({ texts = {} }) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh || {};
  const textsEn = texts.en || {};
  const activeTexts = texts[langKey] || {};
  const initialForm = {
    name: '',
    contact: '',
    _subject: '',
    message: ''
  };
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const [placeholders, setPlaceholders] = useState({
    name: '',
    contact: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const ph = (texts[langKey] && texts[langKey].placeholders) || {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form._subject || !form.message) {
      setError(activeTexts.errorEmpty || '请填写所有字段');
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
        setError(activeTexts.failed || '发送失败');
      }
    } catch {
      setStatus('error');
      setError(activeTexts.failed || '发送失败');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="mb-3">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder={placeholders.name || ''}
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
          placeholder={placeholders.contact || ''}
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
          placeholder={placeholders.subject || ''}
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
          placeholder={placeholders.message || ''}
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <LocalizedSection zhContent={textsZh.sending} enContent={textsEn.sending} />
        ) : (
          <LocalizedSection zhContent={textsZh.button} enContent={textsEn.button} />
        )}
      </button>
      {status === 'success' && (
        <div className="form-message text-success">
          <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
        </div>
      )}
      {status === 'error' && error && <div className="form-message text-error">{error}</div>}
    </form>
  );
}
