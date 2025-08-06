import { ENDPOINTS, JSON_HEADERS } from '../constants/api';
import * as Sentry from '@sentry/react';

async function request<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: { ...JSON_HEADERS, ...(options.headers || {}) },
      ...options
    });
    if (!response.ok) {
      const error = new Error(`Request failed: ${response.status}`);
      Sentry.captureException(error, {
        tags: { url },
        extra: { options }
      });
      throw error;
    }
    return response.json() as Promise<T>;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { url },
      extra: { options }
    });
    throw error;
  }
}

const apiClient = {
  chat: {
    sendMessage: (message: string): Promise<any> =>
      request(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ message })
      }),
    reset: (): Promise<any> =>
      request(ENDPOINTS.RESET, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({})
      })
  },
  request
};

export default apiClient;
