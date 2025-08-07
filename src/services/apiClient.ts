import { ENDPOINTS, JSON_HEADERS } from '../constants/api';
import * as Sentry from '@sentry/react';
import type {
  ChatSendMessageRequest,
  ChatSendMessageResponse,
  ResetChatRequest,
  ResetChatResponse
} from '../types';

async function request<TResponse>(url: string, options: RequestInit = {}): Promise<TResponse> {
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
    return response.json() as Promise<TResponse>;
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
    sendMessage: (payload: ChatSendMessageRequest): Promise<ChatSendMessageResponse> =>
      request<ChatSendMessageResponse>(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      }),
    reset: (payload: ResetChatRequest = {}): Promise<ResetChatResponse> =>
      request<ResetChatResponse>(ENDPOINTS.RESET, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
      })
  },
  request
};

export default apiClient;
