import { ENDPOINTS, JSON_HEADERS } from '../constants/api.js';
import * as Sentry from '@sentry/react';

async function request(url, options = {}) {
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
    return response.json();
  } catch (error) {
    Sentry.captureException(error, {
      tags: { url },
      extra: { options }
    });
    throw error;
  }
}

export default {
  chat: {
    sendMessage: (message) =>
      request(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ message })
      }),
    reset: () =>
      request(ENDPOINTS.RESET, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({})
      })
  },
  request
};
