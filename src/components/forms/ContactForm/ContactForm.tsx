import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { submitContactForm, type ContactFormSubmission } from '../../../services/contactService';
import { useLanguage } from '../../providers';
import { LocalizedSection } from '../../ui';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface PlaceholderTexts {
  name?: string;
  contact?: string;
  subject?: string;
  message?: string;
}

interface LangTexts {
  placeholders?: PlaceholderTexts;
  errorEmpty?: string;
  failed?: string;
  sending?: string;
  button?: string;
  success?: string;
  [key: string]: string | PlaceholderTexts | undefined;
}

interface ContactFormTexts {
  zh?: LangTexts;
  en?: LangTexts;
  [key: string]: LangTexts | undefined;
}

interface ContactFormProps {
  texts?: ContactFormTexts;
}

export default function ContactForm({ texts = {} }: ContactFormProps) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh || {};
  const textsEn = texts.en || {};
  const activeTexts = texts[langKey] || {};
  const initialForm: ContactFormSubmission = {
    name: '',
    contact: '',
    _subject: '',
    message: ''
  };
  const [form, setForm] = useState<ContactFormSubmission>(initialForm);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string>('');
  const [placeholders, setPlaceholders] = useState<PlaceholderTexts>({
    name: '',
    contact: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const ph: PlaceholderTexts = texts[langKey]?.placeholders ?? {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form.name || !form.contact || !form._subject || !form.message) {
      setError(activeTexts.errorEmpty || '请填写所有字段');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const submitted = await submitContactForm(form);
      if (submitted) {
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
      <div className="c-form-group">
        <input
          type="text"
          name="name"
          className="c-form-control"
          placeholder={placeholders.name || ''}
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="c-form-group">
        <input
          type="text"
          name="contact"
          className="c-form-control"
          placeholder={placeholders.contact || ''}
          value={form.contact}
          onChange={handleChange}
          required
        />
      </div>
      <div className="c-form-group">
        <input
          type="text"
          name="_subject"
          className="c-form-control"
          placeholder={placeholders.subject || ''}
          value={form._subject}
          onChange={handleChange}
          required
        />
      </div>
      <div className="c-form-group">
        <textarea
          name="message"
          className="c-form-control"
          rows={5}
          placeholder={placeholders.message || ''}
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="c-btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <LocalizedSection zhContent={textsZh.sending} enContent={textsEn.sending} />
        ) : (
          <LocalizedSection zhContent={textsZh.button} enContent={textsEn.button} />
        )}
      </button>
      {status === 'success' && (
        <div className="c-form-message u-text-success">
          <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
        </div>
      )}
      {status === 'error' && error && <div className="c-form-message u-text-error">{error}</div>}
    </form>
  );
}
