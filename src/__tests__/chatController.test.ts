import { beforeEach, describe, it, expect, vi } from 'vitest';

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn()
}));

import * as Sentry from '@sentry/react';
import { createChatController, type ChatMessageUpdater } from '../controllers/chatController';
import { ROLES } from '../constants';
import type { ChatMessage, ChatRole } from '../types/chat';

const sentryMock = Sentry as unknown as {
  addBreadcrumb: ReturnType<typeof vi.fn>;
};

function createHistoryHarness(initial: ChatMessage[] = []) {
  let messages = [...initial];

  return {
    get messages() {
      return messages;
    },
    addMessage: vi.fn((role: ChatRole, content: string) => {
      messages = [...messages, { role, content }];
      return messages;
    }),
    setMessages: vi.fn((updater: ChatMessageUpdater) => {
      messages = typeof updater === 'function' ? updater(messages) : updater;
      return messages;
    }),
    clearHistory: vi.fn(() => {
      messages = [];
    })
  };
}

describe('chatController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('streams a trimmed user message into one assistant message', async () => {
    const history = createHistoryHarness();
    const onAccepted = vi.fn();
    const onFirstChunk = vi.fn();
    const onChunk = vi.fn();
    const onComplete = vi.fn();
    const onFinally = vi.fn();
    const sendMessageToAI = vi.fn(
      async (
        message: string,
        onChunkCallback?: (chunk: string) => void,
        options?: { signal?: AbortSignal }
      ) => {
        expect(message).toBe('hello');
        expect(options?.signal).toBeInstanceOf(AbortSignal);
        onChunkCallback?.('partial');
        onChunkCallback?.('partial answer');
        return 'final answer';
      }
    );
    const controller = createChatController({
      sendMessageToAI,
      resetChat: vi.fn(async () => true)
    });

    await expect(
      controller.sendMessage({
        input: '  hello  ',
        addMessage: history.addMessage,
        setMessages: history.setMessages,
        onAccepted,
        onFirstChunk,
        onChunk,
        onComplete,
        onFinally
      })
    ).resolves.toEqual({ status: 'sent', response: 'final answer' });

    expect(history.messages).toEqual([
      { role: ROLES.USER, content: 'hello' },
      { role: ROLES.AI, content: 'final answer' }
    ]);
    expect(onAccepted).toHaveBeenCalledWith('hello');
    expect(onFirstChunk).toHaveBeenCalledTimes(1);
    expect(onChunk).toHaveBeenNthCalledWith(1, 'partial');
    expect(onChunk).toHaveBeenNthCalledWith(2, 'partial answer');
    expect(onComplete).toHaveBeenCalledWith('final answer');
    expect(onFinally).toHaveBeenCalledTimes(1);
    expect(controller.hasActiveRequest()).toBe(false);
  });

  it('records chat breadcrumbs without sending message contents', async () => {
    const history = createHistoryHarness();
    const sendMessageToAI = vi.fn(
      async (_message: string, onChunkCallback?: (chunk: string) => void) => {
        onChunkCallback?.('partial answer');
        return 'final answer';
      }
    );
    const controller = createChatController({
      sendMessageToAI,
      resetChat: vi.fn(async () => true)
    });

    await controller.sendMessage({
      input: 'private question',
      addMessage: history.addMessage,
      setMessages: history.setMessages
    });

    expect(sentryMock.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'chat',
        message: 'Chat send accepted',
        data: { input_length: 'private question'.length }
      })
    );
    expect(sentryMock.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'chat',
        message: 'Chat send completed',
        data: { response_length: 'final answer'.length }
      })
    );
    expect(JSON.stringify(sentryMock.addBreadcrumb.mock.calls)).not.toContain('private question');
    expect(JSON.stringify(sentryMock.addBreadcrumb.mock.calls)).not.toContain('final answer');
  });

  it('skips empty input without mutating history', async () => {
    const history = createHistoryHarness();
    const sendMessageToAI = vi.fn(async () => 'unused');
    const onAccepted = vi.fn();
    const controller = createChatController({
      sendMessageToAI,
      resetChat: vi.fn(async () => true)
    });

    await expect(
      controller.sendMessage({
        input: '   ',
        addMessage: history.addMessage,
        setMessages: history.setMessages,
        onAccepted
      })
    ).resolves.toEqual({ status: 'skipped-empty' });

    expect(sendMessageToAI).not.toHaveBeenCalled();
    expect(history.messages).toEqual([]);
    expect(onAccepted).not.toHaveBeenCalled();
  });

  it('records an assistant error when streaming fails', async () => {
    const history = createHistoryHarness();
    const error = new Error('network down');
    const onError = vi.fn();
    const onFinally = vi.fn();
    const controller = createChatController({
      sendMessageToAI: vi.fn(async () => {
        throw error;
      }),
      resetChat: vi.fn(async () => true)
    });

    const result = await controller.sendMessage({
      input: 'hello',
      addMessage: history.addMessage,
      setMessages: history.setMessages,
      onError,
      onFinally
    });

    expect(result).toEqual({ status: 'error', error });
    expect(history.messages).toEqual([
      { role: ROLES.USER, content: 'hello' },
      { role: ROLES.AI, content: 'Error: network down' }
    ]);
    expect(onError).toHaveBeenCalledWith(error);
    expect(onFinally).toHaveBeenCalledTimes(1);
  });

  it('aborts the active stream request through the controller boundary', async () => {
    const history = createHistoryHarness();
    let capturedSignal: AbortSignal | undefined;
    const controller = createChatController({
      sendMessageToAI: vi.fn(
        (
          _message: string,
          _onChunk?: (chunk: string) => void,
          options?: { signal?: AbortSignal }
        ) =>
          new Promise<string>((_resolve, reject) => {
            capturedSignal = options?.signal;
            capturedSignal?.addEventListener('abort', () => reject(new Error('aborted')), {
              once: true
            });
          })
      ),
      resetChat: vi.fn(async () => true)
    });

    const sendPromise = controller.sendMessage({
      input: 'hello',
      addMessage: history.addMessage,
      setMessages: history.setMessages
    });

    expect(controller.hasActiveRequest()).toBe(true);
    expect(controller.cancelActiveRequest()).toBe(true);
    expect(capturedSignal?.aborted).toBe(true);

    await expect(sendPromise).resolves.toEqual({
      status: 'error',
      error: expect.objectContaining({ message: 'aborted' })
    });
    expect(history.messages.at(-1)).toEqual({ role: ROLES.AI, content: 'Error: aborted' });
    expect(controller.hasActiveRequest()).toBe(false);
  });

  it('clears local history after a successful reset', async () => {
    const history = createHistoryHarness([{ role: ROLES.USER, content: 'old' }]);
    const onSuccess = vi.fn();
    const onFinally = vi.fn();
    const controller = createChatController({
      sendMessageToAI: vi.fn(async () => 'unused'),
      resetChat: vi.fn(async () => true)
    });

    await expect(
      controller.resetHistory({
        clearHistory: history.clearHistory,
        errorPrefix: 'Reset failed',
        onSuccess,
        onFinally
      })
    ).resolves.toEqual({ status: 'reset' });

    expect(history.messages).toEqual([]);
    expect(history.clearHistory).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledTimes(1);
  });

  it('returns a localized reset error message when reset fails', async () => {
    const history = createHistoryHarness([{ role: ROLES.USER, content: 'old' }]);
    const error = new Error('service unavailable');
    const onError = vi.fn();
    const controller = createChatController({
      sendMessageToAI: vi.fn(async () => 'unused'),
      resetChat: vi.fn(async () => {
        throw error;
      })
    });

    await expect(
      controller.resetHistory({
        clearHistory: history.clearHistory,
        errorPrefix: 'Reset failed',
        onError
      })
    ).resolves.toEqual({
      status: 'error',
      error,
      message: 'Reset failed: service unavailable'
    });

    expect(history.messages).toEqual([{ role: ROLES.USER, content: 'old' }]);
    expect(history.clearHistory).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('Reset failed: service unavailable', error);
  });
});
