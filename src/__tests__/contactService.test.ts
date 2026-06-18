import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONTACT_FORM_ENDPOINT } from '../constants';
import { submitContactForm, type ContactFormSubmission } from '../services/contactService';

const payload: ContactFormSubmission = {
  name: 'Renda',
  contact: 'renda@example.com',
  _subject: 'Hello World',
  message: 'Hi there'
};

describe('contactService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits the legacy contact form as URL-encoded data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ ok: true })
    }) as unknown as typeof fetch;

    await expect(submitContactForm(payload, { fetchImpl: fetchMock })).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      CONTACT_FORM_ENDPOINT,
      expect.objectContaining({
        method: 'POST',
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(payload).toString()
      })
    );
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ credentials: expect.any(String) })
    );
  });

  it('returns false when the legacy contact endpoint does not report ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ ok: false })
    }) as unknown as typeof fetch;

    await expect(submitContactForm(payload, { fetchImpl: fetchMock })).resolves.toBe(false);
  });

  it('lets network and malformed response errors reach the form caller', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(submitContactForm(payload, { fetchImpl: fetchMock })).rejects.toThrow('offline');
  });
});
