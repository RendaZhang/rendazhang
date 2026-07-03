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

  it('shows only the short preset question while sending guide mode metadata', async () => {
    render(<Chat />);

    fireEvent.click(screen.getByRole('button', { name: 'What does PersonalWeb prove?' }));

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(input.value).toBe('What does PersonalWeb prove?');
    expect(input.value).not.toContain('Answer using only the public PersonalWeb context below');
    expect(sendMessageToAI).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(sendMessageToAI).toHaveBeenCalled();
    });
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).toBe('What does PersonalWeb prove?');
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
    expect(chatHistory.addMessage).toHaveBeenCalledWith(ROLES.USER, 'What does PersonalWeb prove?');
  });

  it('renders controlled source hints only for unchanged guide preset answers', async () => {
    render(<Chat />);

    fireEvent.click(screen.getByRole('button', { name: 'What does PersonalWeb prove?' }));
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    const hintRegion = await screen.findByLabelText('Public source hints for this guided answer');

    expect(screen.getByText('preset answer')).toBeTruthy();
    expect(hintRegion.textContent).toContain('Public sources');
    expect(screen.getByRole('link', { name: '/docs/ project proof' }).getAttribute('href')).toBe(
      '/docs/'
    );
    expect(
      screen.getByRole('link', { name: 'Frontend architecture/testing docs' }).getAttribute('href')
    ).toBe('/docs/');
    expect(
      screen.getByRole('link', { name: 'Backend API/testing docs' }).getAttribute('href')
    ).toBe('/docs/');
    expect(screen.getByRole('link', { name: 'llms.txt public summary' }).getAttribute('href')).toBe(
      '/llms.txt'
    );
    for (const link of hintRegion.querySelectorAll('a')) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    }
    expect(hintRegion.textContent).not.toContain('What does PersonalWeb prove?');
    expect(hintRegion.textContent).not.toContain('preset answer');
    expect(hintRegion.outerHTML).not.toMatch(/https?:\/\/|www\.|[?&][a-z0-9_-]+=/i);
    expect(hintRegion.outerHTML).not.toMatch(
      /\/(?:api|cloudchat|internal|private|server)(?:\/|$)/i
    );
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
      'What does PersonalWeb prove? Please keep it brief.'
    );
    await screen.findByText('preset answer');
    expect(screen.queryByLabelText('Public source hints for this guided answer')).toBeNull();
  });
});
