import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Chat from '../components/chat/Chat';
import { ROLES } from '../constants';
import { resetChat, sendMessageToAI } from '../services';
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

beforeAll(() => {
  document.documentElement.lang = 'en';
  window.scrollTo = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Chat preset question flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/deepseek_chat/');
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

  it('previews the preset and sends guide metadata only after explicit submission', async () => {
    render(<Chat />);

    expect(sendMessageToAI).not.toHaveBeenCalled();
    const topic = screen.getByRole('button', { name: 'PersonalWeb' });
    fireEvent.click(topic);

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(input.value).toBe('What did Renda build in PersonalWeb?');
    expect(topic.getAttribute('aria-pressed')).toBe('true');
    expect(window.location.search).toBe('?preset=personalweb_proof');
    expect(sendMessageToAI).not.toHaveBeenCalled();
    expect(input.value).not.toContain('Answer using only the public PersonalWeb context below');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

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

  it('restores allowlisted URL previews without sending, and ignores unknown or duplicate IDs', () => {
    window.history.replaceState({}, '', '?preset=certification_context');
    render(<Chat />);

    const input = screen.getByRole('textbox', { name: 'Your question' }) as HTMLTextAreaElement;
    expect(input.value).toBe("What does Renda's AWS certification cover?");
    expect(screen.getByRole('button', { name: 'AWS certification', pressed: true })).toBeTruthy();

    function restore(search: string) {
      act(() => {
        window.history.replaceState({}, '', `/deepseek_chat/${search}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    restore('?preset=personalweb_proof');
    expect(input.value).toBe('What did Renda build in PersonalWeb?');
    restore('?preset=personalweb_proof&preset=certification_context');
    expect(input.value).toBe('');
    restore('?preset=invalid');
    expect(input.value).toBe('');
    expect(sendMessageToAI).not.toHaveBeenCalled();
  });

  it('renders controlled source hints only for controlled preset answers', async () => {
    render(<Chat />);

    fireEvent.click(screen.getByRole('button', { name: 'PersonalWeb' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

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

  it('lets the IME confirm and Shift+Enter insert a newline before Enter sends once', async () => {
    render(<Chat />);
    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: '你好' } });

    expect(fireEvent.keyDown(input, { key: 'Enter', isComposing: true })).toBe(true);
    expect(fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 })).toBe(true);
    expect(fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })).toBe(true);
    expect(input.value).toBe('你好');
    expect(sendMessageToAI).not.toHaveBeenCalled();

    expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(false);
    await screen.findByText('preset answer');
    expect(sendMessageToAI).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendMessageToAI).mock.calls[0][0]).toBe('你好');
  });

  it('blocks additional submissions while a preview question is awaiting its answer', async () => {
    let releaseResponse!: () => void;
    const pending = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    vi.mocked(sendMessageToAI).mockImplementationOnce(async (_message, onChunk) => {
      await pending;
      onChunk?.('preset answer');
      return 'preset answer';
    });

    render(<Chat />);
    fireEvent.click(screen.getByRole('button', { name: 'PersonalWeb' }));
    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    const send = screen.getByRole('button', { name: 'Send' }) as HTMLButtonElement;
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(send.disabled).toBe(true);
    fireEvent.click(send);
    fireEvent.submit(input.form!);
    expect(sendMessageToAI).toHaveBeenCalledTimes(1);

    releaseResponse();
    await screen.findByText('preset answer');
  });

  it('sends a typed preset variation as normal free-form chat without guide metadata', async () => {
    render(<Chat />);

    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.click(screen.getByRole('button', { name: 'PersonalWeb' }));
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

  it('does not restore guide metadata if an edited draft is typed back to its original text', async () => {
    render(<Chat />);
    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    const topic = screen.getByRole('button', { name: 'AWS certification' });
    fireEvent.click(topic);
    const originalText = input.value;
    fireEvent.change(input, { target: { value: 'My own question' } });
    fireEvent.change(input, { target: { value: originalText } });
    expect(topic.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await screen.findByText('preset answer');
    expect(sendMessageToAI).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[0]).toBe(originalText);
    expect(vi.mocked(sendMessageToAI).mock.calls[0]?.[2]).not.toHaveProperty('presetId');
  });

  it('keeps the preview on reset cancellation and clears it only on successful confirmation', async () => {
    window.history.replaceState({}, '', '?preset=certification_context');
    render(<Chat />);
    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    const resetButton = screen.getByRole('button', { name: /^Reset$/ });
    fireEvent.click(resetButton);
    fireEvent.click(screen.getByText('Cancel'));
    expect(input.value).toBe("What does Renda's AWS certification cover?");
    expect(resetChat).not.toHaveBeenCalled();
    fireEvent.click(resetButton);
    fireEvent.click(screen.getByText('Reset', { selector: '.c-modal span.is-lang-en' }));

    await waitFor(() => expect(input.value).toBe(''));
    expect(window.location.search).toBe('');
    expect(resetChat).toHaveBeenCalledTimes(1);
    expect(sendMessageToAI).not.toHaveBeenCalled();
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
