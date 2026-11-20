import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { submitContactForm, type ContactFormSubmission } from '../../../services/contactService';
import { addSentryBreadcrumb } from '../../../utils/sentryContext';
import LocalizedSection from '../../ui/data-display/LocalizedSection';

type FormStatus = 'idle' | 'sending' | 'success' | 'invalid' | 'error';

interface LangTexts {
  labels: {
    name: string;
    contact: string;
    subject: string;
    message: string;
  };
  errorEmpty: string;
  failed: string;
  sending: string;
  button: string;
  retry: string;
  success: string;
}

interface ContactFormProps {
  texts: { zh: LangTexts; en: LangTexts };
}

const EMPTY_DRAFT: ContactFormSubmission = {
  name: '',
  contact: '',
  _subject: '',
  message: ''
};

export default function ContactForm({ texts }: ContactFormProps) {
  const { zh: textsZh, en: textsEn } = texts;
  const [form, setForm] = useState(EMPTY_DRAFT);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [ready, setReady] = useState(false);
  const submitting = useRef(false);
  const submitButton = useRef<HTMLButtonElement>(null);
  const restoreSubmitFocus = useRef(false);
  const formId = useId();
  const isSending = status === 'sending';

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if ((status !== 'success' && status !== 'error') || !restoreSubmitFocus.current) return;
    restoreSubmitFocus.current = false;
    if (document.activeElement === document.body && document.hasFocus()) {
      submitButton.current?.focus({ preventScroll: true });
    }
  }, [status]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setForm((draft) => ({ ...draft, [name]: value }));
    setStatus((current) => (current === 'success' || current === 'invalid' ? 'idle' : current));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!ready || submitting.current) return;
    if (Object.values(form).some((value) => !value.trim())) {
      setStatus('invalid');
      return;
    }

    submitting.current = true;
    restoreSubmitFocus.current = document.activeElement === submitButton.current;
    setStatus('sending');
    addSentryBreadcrumb('contact.submit.start');
    try {
      if (await submitContactForm(form)) {
        setStatus('success');
        setForm((draft) => (draft === form ? EMPTY_DRAFT : draft));
        addSentryBreadcrumb('contact.submit.success');
      } else {
        setStatus('error');
        addSentryBreadcrumb('contact.submit.failure', undefined, 'warning');
      }
    } catch {
      setStatus('error');
      addSentryBreadcrumb('contact.submit.error', undefined, 'warning');
    } finally {
      submitting.current = false;
    }
  };

  const buttonLabel = isSending ? 'sending' : status === 'error' ? 'retry' : 'button';

  return (
    <form onSubmit={handleSubmit} className="contact-form" data-form-status={status} method="post">
      <fieldset className="c-contact-fields" disabled={!ready}>
        <div className="c-form-group">
          <label className="c-form-label" htmlFor={`${formId}-name`}>
            <LocalizedSection zhContent={textsZh.labels.name} enContent={textsEn.labels.name} />
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            name="name"
            autoComplete="name"
            className="c-form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="c-form-group">
          <label className="c-form-label" htmlFor={`${formId}-contact`}>
            <LocalizedSection
              zhContent={textsZh.labels.contact}
              enContent={textsEn.labels.contact}
            />
          </label>
          <input
            id={`${formId}-contact`}
            type="text"
            name="contact"
            className="c-form-control"
            value={form.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="c-form-group">
          <label className="c-form-label" htmlFor={`${formId}-subject`}>
            <LocalizedSection
              zhContent={textsZh.labels.subject}
              enContent={textsEn.labels.subject}
            />
          </label>
          <input
            id={`${formId}-subject`}
            type="text"
            name="_subject"
            className="c-form-control"
            value={form._subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="c-form-group">
          <label className="c-form-label" htmlFor={`${formId}-message`}>
            <LocalizedSection
              zhContent={textsZh.labels.message}
              enContent={textsEn.labels.message}
            />
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            className="c-form-control"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button ref={submitButton} type="submit" className="c-btn-primary" disabled={isSending}>
          <LocalizedSection zhContent={textsZh[buttonLabel]} enContent={textsEn[buttonLabel]} />
        </button>
      </fieldset>

      <p className="c-contact-form-error" role="alert">
        {status === 'invalid' && (
          <LocalizedSection zhContent={textsZh.errorEmpty} enContent={textsEn.errorEmpty} />
        )}
        {status === 'error' && (
          <LocalizedSection zhContent={textsZh.failed} enContent={textsEn.failed} />
        )}
      </p>
      <p className="c-contact-form-status" role="status">
        {status === 'success' && (
          <span className="c-contact-stamp">
            <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
          </span>
        )}
      </p>
    </form>
  );
}
