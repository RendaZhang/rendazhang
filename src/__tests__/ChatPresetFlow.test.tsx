import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Chat from '../components/chat/Chat';
import { ROLES } from '../constants';
import { sendMessageToAI } from '../services';
import type { ChatMessage, ChatRole } from '../types/chat';
import type { ChatMessageUpdater } from '../controllers/chatController';

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

vi.mock('../hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../hooks')>();
  return {
    ...actual,
    useChatHistory: () => chatHistory
  };
});

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

beforeAll(() => {
  window.scrollTo = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Chat preset question flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chatHistory.messages = [];
    chatHistory.addMessage.mockImplementation((role: ChatRole, content: string) => {
      chatHistory.messages = [...chatHistory.messages, { role, content }];
      return chatHistory.messages;
    });
    chatHistory.setMessages.mockImplementation((updater: ChatMessageUpdater) => {
      chatHistory.messages =
        typeof updater === 'function' ? updater(chatHistory.messages) : updater;
      return chatHistory.messages;
    });
    chatHistory.clearHistory.mockImplementation(() => {
      chatHistory.messages = [];
    });
    vi.mocked(sendMessageToAI).mockImplementation(async (_message, onChunk) => {
      onChunk?.('preset answer');
      return 'preset answer';
    });
  });

  it('sends the short preset question immediately with guide mode metadata', async () => {
    render(<Chat />);

    expect(sendMessageToAI).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'What did Renda build in PersonalWeb?' }));

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(input.value).toBe('');
    expect(input.value).not.toContain('Answer using only the public PersonalWeb context below');

    await waitFor(() => {
      expect(sendMessageToAI).toHaveBeenCalled();
    });
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).toBe(
      'What did Renda build in PersonalWeb?'
    );
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[2]).toEqual(
      expect.objectContaining({
        guideMode: 'public_site',
        presetId: 'personalweb_proof',
        locale: 'en',
        signal: expect.any(AbortSignal)
      })
    );
    expect(JSON.stringify(vi.mocked(sendMessageToAI).mock.calls)).not.toContain(
      'Answer using only the public PersonalWeb context below'
    );
    expect(chatHistory.addMessage).toHaveBeenCalledWith(
      ROLES.USER,
      'What did Renda build in PersonalWeb?'
    );
  });

  it('renders controlled source hints only for controlled preset answers', async () => {
    render(<Chat />);

    fireEvent.click(screen.getByRole('button', { name: 'What did Renda build in PersonalWeb?' }));

    const hintRegion = await screen.findByLabelText('Public pages that support this guided answer');

    expect(screen.getByText('preset answer')).toBeTruthy();
    expect(hintRegion.textContent).toContain('Where to verify');
    expect(
      screen.getByRole('link', { name: 'How PersonalWeb was built' }).getAttribute('href')
    ).toBe('/docs/');
    expect(
      screen.getByRole('link', { name: 'Frontend architecture and tests' }).getAttribute('href')
    ).toBe('/docs/');
    expect(screen.getByRole('link', { name: 'Backend API and tests' }).getAttribute('href')).toBe(
      '/docs/'
    );
    expect(screen.getByRole('link', { name: 'Public site summary' }).getAttribute('href')).toBe(
      '/llms.txt'
    );
    for (const link of hintRegion.querySelectorAll('a')) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    }
    expect(hintRegion.textContent).not.toContain('What did Renda build in PersonalWeb?');
    expect(hintRegion.textContent).not.toContain('preset answer');
    expect(hintRegion.outerHTML).not.toMatch(/https?:\/\/|www\.|[?&][a-z0-9_-]+=/i);
    expect(hintRegion.outerHTML).not.toMatch(
      /\/(?:api|cloudchat|internal|private|server)(?:\/|$)/i
    );
  });

  it('sends a typed preset variation as normal free-form chat without guide metadata', async () => {
    render(<Chat />);

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(input, {
      target: { value: 'What did Renda build in PersonalWeb? Please keep it brief.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(sendMessageToAI).toHaveBeenCalled();
    });
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).toBe(
      'What did Renda build in PersonalWeb? Please keep it brief.'
    );
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[2]).not.toEqual(
      expect.objectContaining({
        guideMode: 'public_site'
      })
    );
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).not.toContain(
      'Answer using only the public PersonalWeb context below'
    );
    expect(chatHistory.addMessage).toHaveBeenCalledWith(
      ROLES.USER,
      'What did Renda build in PersonalWeb? Please keep it brief.'
    );
    await screen.findByText('preset answer');
    expect(screen.queryByLabelText('Public pages that support this guided answer')).toBeNull();
  });

  it('keeps the empty preset invitation at the top of its scroll container', async () => {
    const scrollHeightDescriptor = Object.getOwnPropertyDescriptor(
      window.HTMLElement.prototype,
      'scrollHeight'
    );
    Object.defineProperty(window.HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return this.classList?.contains('c-chat-container') ? 600 : 0;
      }
    });

    try {
      render(<Chat />);

      const container = document.querySelector('.c-chat-container') as HTMLDivElement;
      await waitFor(() => expect(container.scrollTop).toBe(0));
      expect(screen.getByRole('heading', { name: 'Ask about Renda and PersonalWeb' })).toBeTruthy();
    } finally {
      if (scrollHeightDescriptor) {
        Object.defineProperty(window.HTMLElement.prototype, 'scrollHeight', scrollHeightDescriptor);
      } else {
        Reflect.deleteProperty(window.HTMLElement.prototype, 'scrollHeight');
      }
    }
  });

  it('keeps a long existing answer scrolled to the latest content', async () => {
    const scrollHeightDescriptor = Object.getOwnPropertyDescriptor(
      window.HTMLElement.prototype,
      'scrollHeight'
    );
    Object.defineProperty(window.HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return this.classList?.contains('c-chat-container') ? 900 : 0;
      }
    });
    chatHistory.messages = [
      { role: ROLES.USER, content: 'Tell me about PersonalWeb.' },
      { role: ROLES.AI, content: 'Public project details. '.repeat(80) }
    ];

    try {
      render(<Chat />);

      const container = document.querySelector('.c-chat-container') as HTMLDivElement;
      await waitFor(() => expect(container.scrollTop).toBe(900));
      expect(screen.getByRole('textbox')).toBeTruthy();
    } finally {
      if (scrollHeightDescriptor) {
        Object.defineProperty(window.HTMLElement.prototype, 'scrollHeight', scrollHeightDescriptor);
      } else {
        Reflect.deleteProperty(window.HTMLElement.prototype, 'scrollHeight');
      }
    }
  });
});
