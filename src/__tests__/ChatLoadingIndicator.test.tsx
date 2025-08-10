import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Chat from '../components/chat/Chat';
import type { ChatMessage } from '../types/chat';

vi.mock('../services', () => ({
  sendMessageToAI: vi.fn(),
  resetChat: vi.fn()
}));

const chatHistory = {
  messages: [] as ChatMessage[],
  addMessage: vi.fn(),
  setMessages: vi.fn(),
  clearHistory: vi.fn(),
  isLoaded: false
};

vi.mock('../hooks', () => ({
  useChatHistory: () => chatHistory
}));

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

describe('Chat loading indicator', () => {
  it('removes skeleton after load completes', () => {
    const { rerender } = render(<Chat />);
    expect(document.querySelector('.c-chat-widget-skeleton')).not.toBeNull();

    chatHistory.isLoaded = true;
    rerender(<Chat />);

    expect(document.querySelector('.c-chat-widget-skeleton')).toBeNull();
    const info = document.querySelector('.c-info-text .is-lang-en');
    expect(info?.textContent).toBe('Conversation ready. Type a message to start.');
  });
});
