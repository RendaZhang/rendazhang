import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../components/forms/ContactForm/ContactForm';
import { ABOUT_CONTENT } from '../content/aboutContent';
import { submitContactForm } from '../services/contactService';

vi.mock('../services/contactService', () => ({ submitContactForm: vi.fn() }));

const draft = {
  name: 'Example sender',
  contact: 'example@example.invalid',
  _subject: 'Example subject',
  message: 'Example project inquiry.'
};

function renderForm() {
  render(
    <ContactForm texts={{ zh: ABOUT_CONTENT.zh.contact.form, en: ABOUT_CONTENT.en.contact.form }} />
  );
  return {
    name: screen.getByLabelText(/Your Name/) as HTMLInputElement,
    contact: screen.getByLabelText(/Email or Phone/) as HTMLInputElement,
    _subject: screen.getByLabelText(/Subject/) as HTMLInputElement,
    message: screen.getByLabelText(/Message/) as HTMLTextAreaElement,
    send: screen.getByRole('button', { name: /Send Message/ })
  };
}

function fill(fields: Record<keyof typeof draft, HTMLElement>, contact = draft.contact) {
  for (const name of Object.keys(draft) as (keyof typeof draft)[]) {
    fireEvent.change(fields[name], {
      target: { value: name === 'contact' ? contact : draft[name] }
    });
  }
}

beforeEach(() => vi.mocked(submitContactForm).mockReset());

describe('Contact form feedback', () => {
  it('focuses the first missing field and maps inline errors without making a request', () => {
    const { name, contact, _subject, message, send } = renderForm();
    for (const field of [name, contact, _subject, message]) {
      expect(field.getAttribute('aria-invalid')).toBe('false');
      expect(field.hasAttribute('aria-describedby')).toBe(false);
    }
    fireEvent.click(send);

    expect(document.activeElement).toBe(name);
    expect(submitContactForm).not.toHaveBeenCalled();
    const missingMessages = [
      [name, 'Enter your name.'],
      [contact, 'Enter an email address or phone number.'],
      [_subject, 'Enter a subject.'],
      [message, 'Write a message.']
    ] as const;
    for (const [field, text] of missingMessages) {
      const error = screen.getByText(text).parentElement;
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toBe(error?.id);
    }
  });

  it('explains unsupported contact formats and accepts a corrected formatted phone number', async () => {
    vi.mocked(submitContactForm).mockResolvedValue(true);
    const fields = renderForm();
    fill(fields, 'not an email or phone');
    fireEvent.click(fields.send);
    expect(document.activeElement).toBe(fields.contact);
    expect(screen.getByText('Use a valid email address or phone number.')).toBeTruthy();
    expect(screen.getByText('请输入有效的邮箱或手机号。')).toBeTruthy();
    expect(submitContactForm).not.toHaveBeenCalled();

    const phone = '+1 (415) 555-0100';
    fireEvent.change(fields.contact, { target: { value: phone } });
    expect(fields.contact.getAttribute('aria-invalid')).toBe('false');
    expect(fields.contact.hasAttribute('aria-describedby')).toBe(false);
    fireEvent.click(fields.send);
    await screen.findByText('Sent', { exact: true });
    expect(submitContactForm).toHaveBeenCalledExactlyOnceWith({ ...draft, contact: phone });
  });

  it('keeps the draft after a failed response and clears it only after an accepted retry', async () => {
    vi.mocked(submitContactForm).mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const fields = renderForm();
    fill(fields);
    fireEvent.click(fields.send);
    await screen.findByText(/Your draft is still here/);
    expect(screen.queryByText('Sent', { exact: true })).toBeNull();
    for (const name of Object.keys(draft) as (keyof typeof draft)[]) {
      expect(fields[name].value).toBe(draft[name]);
    }

    fireEvent.click(screen.getByRole('button', { name: /Retry send/ }));
    await screen.findByText('Sent', { exact: true });
    expect(vi.mocked(submitContactForm).mock.calls).toEqual([[draft], [draft]]);
    for (const name of Object.keys(draft) as (keyof typeof draft)[]) {
      expect(fields[name].value).toBe('');
    }
  });
});
