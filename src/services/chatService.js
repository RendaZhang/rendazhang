// Markdown libraries expected to be loaded globally
import { ENDPOINTS, JSON_HEADERS } from '../config.js';

export async function sendMessageToAI(userInput, onChunkCallback) {
  try {
    const response = await fetch(ENDPOINTS.CHAT, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ message: userInput })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const reader = response.body.getReader();
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
          console.error('Parse error:', e);
        }
      }
    }

    return aiMessage;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function resetChat() {
  try {
    const response = await fetch(ENDPOINTS.RESET, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`Reset failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Reset error:', error);
    throw error;
  }
}
