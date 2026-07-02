import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Chat from '../components/chat/Chat';
import { buildChatGuidePresetPrompt } from '../content/chatGuideKnowledge';
import { sendMessageToAI } from '../services';
import type { ChatMessage } from '../types/chat';

vi.mock('../services', () => ({
  sendMessageToAI: vi.fn(async () => 'preset answer'),
  resetChat: vi.fn(async () => true)
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

beforeAll(() => {
  window.scrollTo = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Chat preset question flow', () => {
  beforeEach(() => {
    chatHistory.messages = [];
    chatHistory.addMessage.mockClear();
    chatHistory.setMessages.mockClear();
    chatHistory.clearHistory.mockClear();
    vi.mocked(sendMessageToAI).mockClear();
  });

  it('fills the existing input first and sends only through the normal send button', async () => {
    render(<Chat />);

    fireEvent.click(screen.getByRole('button', { name: 'What does PersonalWeb prove?' }));

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    const expectedPrompt = buildChatGuidePresetPrompt(
      'personalweb_proof',
      'What does PersonalWeb prove?',
      'en'
    );

    expect(input.value).toBe(expectedPrompt);
    expect(input.value).toContain('Answer using only the public PersonalWeb context below');
    expect(input.value).toContain('PersonalWeb is a public project proof surface');
    expect(sendMessageToAI).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(sendMessageToAI).toHaveBeenCalled();
    });
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).toBe(expectedPrompt);
  });
});
