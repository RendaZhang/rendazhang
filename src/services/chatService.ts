// Markdown libraries expected to be loaded globally
import { ENDPOINTS } from '../constants/api';
import type { ResetChatResponse } from '../types';
import { logger } from '../utils';
import apiClient from './apiClient';

export interface ChatRequestOptions {
  signal?: AbortSignal;
  guideMode?: ChatGuideMode;
  presetId?: ChatGuideRequestPresetId;
  locale?: ChatGuideLocale;
}

export const CHAT_GUIDE_MODE_PUBLIC_SITE = 'public_site' as const;

export type ChatGuideMode = typeof CHAT_GUIDE_MODE_PUBLIC_SITE;
export type ChatGuideLocale = 'en' | 'zh';
export type ChatGuideRequestPresetId =
  | 'who_is_renda'
  | 'personalweb_proof'
  | 'cloud_native_evidence'
  | 'certification_context'
  | 'recruiter_summary';

interface ChatRequestBody {
  message: string;
  guideMode?: ChatGuideMode;
  presetId?: ChatGuideRequestPresetId;
  locale?: ChatGuideLocale;
}

function buildChatRequestBody(userInput: string, options: ChatRequestOptions): ChatRequestBody {
  const body: ChatRequestBody = { message: userInput };

  if (options.guideMode === CHAT_GUIDE_MODE_PUBLIC_SITE) {
    body.guideMode = options.guideMode;
    if (options.presetId) {
      body.presetId = options.presetId;
    }
    if (options.locale) {
      body.locale = options.locale;
    }
  }

  return body;
}

export async function sendMessageToAI(
  userInput: string,
  onChunkCallback?: (chunk: string) => void,
  options: ChatRequestOptions = {}
): Promise<string> {
  try {
    let aiMessage = '';

    const processLine = (line: string) => {
      if (!line.trim()) {
        return;
      }
      try {
        const data = JSON.parse(line) as { text?: unknown };
        if (typeof data.text === 'string') {
          aiMessage += data.text;
          // Pass accumulated Markdown back to caller
          if (onChunkCallback) {
            onChunkCallback(aiMessage);
          }
        }
      } catch (e) {
        logger.error('Parse error:', e);
      }
    };

    await apiClient.streamLines(ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify(buildChatRequestBody(userInput, options)),
      signal: options.signal,
      unauthorizedMessage: 'Unauthorized',
      failureMessage: (response) => `Request failed: ${response.status}`,
      onLine: processLine
    });

    return aiMessage;
  } catch (error) {
    logger.error('API error:', error);
    throw error;
  }
}

export async function resetChat(): Promise<boolean> {
  try {
    await apiClient.request<ResetChatResponse>(ENDPOINTS.RESET, {
      method: 'POST',
      body: JSON.stringify({}),
      unauthorizedMessage: 'Unauthorized',
      failureMessage: (response) => `Reset failed: ${response.status}`
    });

    return true;
  } catch (error) {
    logger.error('Reset error:', error);
    throw error;
  }
}
