// Markdown libraries expected to be loaded globally
import { ENDPOINTS, JSON_HEADERS } from '../constants/api';
import logger from '../utils/logger';

export async function sendMessageToAI(
  userInput: string,
  onChunkCallback?: (chunk: string) => void
): Promise<string> {
  try {
    const response = await fetch(ENDPOINTS.CHAT, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ message: userInput }),
      credentials: 'include'
    });

    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Readable stream not supported');
    }
    const decoder = new TextDecoder();
    let aiMessage = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.text) {
            aiMessage += data.text;
            // Pass accumulated Markdown back to caller
            if (onChunkCallback) {
              onChunkCallback(aiMessage);
            }
          }
        } catch (e) {
          logger.error('Parse error:', e);
        }
      }
    }

    return aiMessage;
  } catch (error) {
    logger.error('API error:', error);
    throw error;
  }
}

export async function resetChat(): Promise<boolean> {
  try {
    const response = await fetch(ENDPOINTS.RESET, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({}),
      credentials: 'include'
    });

    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`Reset failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    logger.error('Reset error:', error);
    throw error;
  }
}
