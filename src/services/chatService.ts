// Markdown libraries expected to be loaded globally
import { ENDPOINTS, JSON_HEADERS } from '../constants/api';
import { LOGIN_STATE_KEY } from '../constants';
import { storage, logger } from '../utils';

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
      storage.remove(LOGIN_STATE_KEY);
      document.documentElement.dataset.loggedIn = 'false';
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

    let pendingLine = '';

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

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      pendingLine += decoder.decode(value, { stream: true });
      const lines = pendingLine.split('\n');
      pendingLine = lines.pop() ?? '';

      for (const line of lines) {
        processLine(line);
      }
    }

    pendingLine += decoder.decode();
    processLine(pendingLine);

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
      storage.remove(LOGIN_STATE_KEY);
      document.documentElement.dataset.loggedIn = 'false';
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
