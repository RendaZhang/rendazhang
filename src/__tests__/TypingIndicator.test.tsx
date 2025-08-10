import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Chat from '../components/chat/Chat';
import type { ChatMessage } from '../types/chat';

vi.mock('../services', () => ({
  sendMessageToAI: vi.fn((_msg: string, onChunk?: (chunk: string) => void) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        onChunk?.('partial');
        resolve('partial');
      }, 0);
    });
  }),
  resetChat: vi.fn()
}));

const chatHistory = {
  messages: [] as ChatMessage[],
  addMessage: vi.fn(),
  setMessages: vi.fn(),
  clearHistory: vi.fn(),
  isLoaded: true
};

vi.mock('../hooks', () => ({
  useChatHistory: () => chatHistory
}));

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

describe('Typing indicator', () => {
  it('hides after streaming starts', async () => {
    const { getByRole } = render(<Chat />);
    const textarea = getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'hello' } });
    const sendButton = getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    const indicator = document.getElementById('typing-indicator')!;
    expect(indicator.style.display).toBe('block');

    await waitFor(() => {
      expect(indicator.style.display).toBe('none');
    });
  });
});
