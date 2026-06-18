import { CONTACT_FORM_ENDPOINT } from '../constants';

export interface ContactFormSubmission extends Record<string, string> {
  name: string;
  contact: string;
  _subject: string;
  message: string;
}

interface ContactFormResponse {
  ok?: unknown;
}

interface ContactFormServiceOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

export async function submitContactForm(
  payload: ContactFormSubmission,
  options: ContactFormServiceOptions = {}
): Promise<boolean> {
  const response = await (options.fetchImpl ?? fetch)(options.endpoint ?? CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(payload).toString()
  });
  const data = (await response.json()) as ContactFormResponse;
  return Boolean(data.ok);
}
