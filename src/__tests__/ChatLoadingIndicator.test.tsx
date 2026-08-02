import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
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

beforeAll(() => {
  // jsdom does not implement scrollTo
  window.scrollTo = vi.fn();
});

describe('Chat loading indicator', () => {
  it('removes skeleton after load completes', () => {
    const { rerender } = render(<Chat />);
    expect(document.querySelector('.c-chat-widget-skeleton')).not.toBeNull();

    chatHistory.isLoaded = true;
    rerender(<Chat />);

    expect(document.querySelector('.c-chat-widget-skeleton')).toBeNull();
    expect(document.querySelector('.c-chat-presets-title')?.textContent).toBe(
      'Ask about Renda and PersonalWeb'
    );
  });
});
