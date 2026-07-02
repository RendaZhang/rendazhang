import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Chat from '../components/chat/Chat';
import { buildChatGuidePresetPrompt } from '../content/chatGuideKnowledge';
import { ROLES } from '../constants';
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

  it('shows only the short preset question while sending grounded context internally', async () => {
    render(<Chat />);

    fireEvent.click(screen.getByRole('button', { name: 'What does PersonalWeb prove?' }));

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    const expectedPrompt = buildChatGuidePresetPrompt(
      'personalweb_proof',
      'What does PersonalWeb prove?',
      'en'
    );

    expect(input.value).toBe('What does PersonalWeb prove?');
    expect(input.value).not.toContain('Answer using only the public PersonalWeb context below');
    expect(sendMessageToAI).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(sendMessageToAI).toHaveBeenCalled();
    });
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).toBe(expectedPrompt);
    expect(chatHistory.addMessage).toHaveBeenCalledWith(ROLES.USER, 'What does PersonalWeb prove?');
    expect(chatHistory.addMessage).not.toHaveBeenCalledWith(ROLES.USER, expectedPrompt);
  });

  it('sends edited preset text as normal free-form chat without hidden context', async () => {
    render(<Chat />);

    fireEvent.click(screen.getByRole('button', { name: 'What does PersonalWeb prove?' }));

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(input, {
      target: { value: 'What does PersonalWeb prove? Please keep it brief.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(sendMessageToAI).toHaveBeenCalled();
    });
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).toBe(
      'What does PersonalWeb prove? Please keep it brief.'
    );
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).not.toContain(
      'Answer using only the public PersonalWeb context below'
    );
    expect(chatHistory.addMessage).toHaveBeenCalledWith(
      ROLES.USER,
      'What does PersonalWeb prove? Please keep it brief.'
    );
  });
});
