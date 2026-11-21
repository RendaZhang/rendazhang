import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { submitContactForm, type ContactFormSubmission } from '../../../services/contactService';
import { addSentryBreadcrumb } from '../../../utils/sentryContext';
import LocalizedSection from '../../ui/data-display/LocalizedSection';

type FormStatus = 'idle' | 'sending' | 'success' | 'invalid' | 'error';

const FIELDS = [
  { name: 'name', label: 'name' },
  { name: 'contact', label: 'contact' },
  { name: '_subject', label: 'subject' },
  { name: 'message', label: 'message' }
] as const;

type ContactField = (typeof FIELDS)[number]['name'];
type FieldError = 'required' | 'format';
type FieldErrors = Partial<Record<ContactField, FieldError>>;

interface LangTexts {
  labels: {
    name: string;
    contact: string;
    subject: string;
    message: string;
  };
  required: Record<ContactField, string>;
  contactFormat: string;
  privacy: string;
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

function validateField(field: ContactField, value: string): FieldError | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'required';
  if (field !== 'contact') return;
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const digitCount = trimmed.replace(/\D/g, '').length;
  const phone = /^\+?[\d().\s-]+$/.test(trimmed) && digitCount >= 7 && digitCount <= 15;
  if (!email && !phone) return 'format';
}

export default function ContactForm({ texts }: ContactFormProps) {
  const { zh: textsZh, en: textsEn } = texts;
  const [form, setForm] = useState(EMPTY_DRAFT);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [ready, setReady] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submitting = useRef(false);
  const fieldToFocus = useRef<HTMLElement | null>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const restoreSubmitFocus = useRef(false);
  const formId = useId();
  const isSending = status === 'sending';

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const field = fieldToFocus.current;
    fieldToFocus.current = null;
    field?.focus();
  }, [fieldErrors]);

  useEffect(() => {
    if ((status !== 'success' && status !== 'error') || !restoreSubmitFocus.current) return;
    restoreSubmitFocus.current = false;
    if (document.activeElement === document.body && document.hasFocus()) {
      submitButton.current?.focus({ preventScroll: true });
    }
  }, [status]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    const field = name as ContactField;
    setForm((draft) => ({ ...draft, [name]: value }));
    setFieldErrors((current) =>
      current[field] ? { ...current, [field]: validateField(field, value) } : current
    );
    setStatus((current) => (current === 'success' || current === 'invalid' ? 'idle' : current));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!ready || submitting.current) return;
    const errors: FieldErrors = {};
    for (const { name } of FIELDS) {
      const error = validateField(name, form[name]);
      if (error) errors[name] = error;
    }
    const firstInvalid = FIELDS.find(({ name }) => errors[name]);
    if (firstInvalid) {
      const field = event.currentTarget.elements.namedItem(firstInvalid.name);
      fieldToFocus.current = field instanceof HTMLElement ? field : null;
      setFieldErrors(errors);
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
    <form
      onSubmit={handleSubmit}
      className="contact-form"
      data-form-status={status}
      method="post"
      noValidate
    >
      <fieldset className="c-contact-fields" disabled={!ready}>
        {FIELDS.map(({ name, label }) => {
          const id = `${formId}-${label}`;
          const errorId = `${id}-error`;
          const error = fieldErrors[name];
          const controls = {
            id,
            name,
            className: 'c-form-control',
            value: form[name],
            onChange: handleChange,
            required: true,
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? errorId : undefined
          };

          return (
            <div className="c-form-group" key={name}>
              <label className="c-form-label" htmlFor={id}>
                <LocalizedSection
                  zhContent={textsZh.labels[label]}
                  enContent={textsEn.labels[label]}
                />
              </label>
              {name === 'message' ? (
                <textarea {...controls} rows={5} />
              ) : (
                <input
                  {...controls}
                  type="text"
                  autoComplete={name === 'name' ? 'name' : undefined}
                />
              )}
              {error && (
                <p className="c-contact-field-error" id={errorId}>
                  <LocalizedSection
                    zhContent={error === 'format' ? textsZh.contactFormat : textsZh.required[name]}
                    enContent={error === 'format' ? textsEn.contactFormat : textsEn.required[name]}
                  />
                </p>
              )}
            </div>
          );
        })}
        <p className="c-contact-privacy" id={`${formId}-privacy`}>
          <LocalizedSection zhContent={textsZh.privacy} enContent={textsEn.privacy} />
        </p>
        <button
          ref={submitButton}
          type="submit"
          className="c-btn-primary"
          disabled={isSending}
          aria-describedby={`${formId}-privacy`}
        >
          <LocalizedSection zhContent={textsZh[buttonLabel]} enContent={textsEn[buttonLabel]} />
        </button>
      </fieldset>

      <p className="c-contact-form-error" role="alert">
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
