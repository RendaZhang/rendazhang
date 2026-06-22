import { ROLES } from '../constants';
import { resetChat, sendMessageToAI } from '../services';
import type { ChatMessage, ChatRole } from '../types/chat';
import { addSentryBreadcrumb } from '../utils/sentryContext';

export interface ChatStreamOptions {
  signal?: AbortSignal;
}

export type SendMessageToAI = (
  userInput: string,
  onChunkCallback?: (chunk: string) => void,
  options?: ChatStreamOptions
) => Promise<string>;

export type ResetChat = () => Promise<boolean>;
export type ChatMessageUpdater = ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]);
export type AddChatMessage = (role: ChatRole, content: string) => unknown;
export type SetChatMessages = (updater: ChatMessageUpdater) => unknown;
export type ClearChatHistory = () => unknown;

export interface ChatControllerServices {
  sendMessageToAI: SendMessageToAI;
  resetChat: ResetChat;
}

export interface SendChatMessageOptions {
  input: string;
  addMessage: AddChatMessage;
  setMessages: SetChatMessages;
  onAccepted?: (message: string) => void;
  onFirstChunk?: () => void;
  onChunk?: (partial: string) => void;
  onComplete?: (response: string) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export interface ResetChatHistoryOptions {
  clearHistory: ClearChatHistory;
  errorPrefix: string;
  onSuccess?: () => void;
  onError?: (message: string, error: Error) => void;
  onFinally?: () => void;
}

export type SendChatMessageResult =
  | { status: 'skipped-empty' }
  | { status: 'sent'; response: string }
  | { status: 'error'; error: Error };

export type ResetChatHistoryResult =
  | { status: 'reset' }
  | { status: 'error'; error: Error; message: string };

export interface ChatController {
  sendMessage(options: SendChatMessageOptions): Promise<SendChatMessageResult>;
  resetHistory(options: ResetChatHistoryOptions): Promise<ResetChatHistoryResult>;
  cancelActiveRequest(): boolean;
  hasActiveRequest(): boolean;
}

const defaultServices: ChatControllerServices = {
  sendMessageToAI,
  resetChat
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function getErrorStatus(error: Error): number | undefined {
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : undefined;
}

function createAbortController(): AbortController | null {
  if (typeof AbortController === 'undefined') {
    return null;
  }
  return new AbortController();
}

export function upsertAssistantMessage(setMessages: SetChatMessages, content: string): void {
  setMessages((prev) => {
    const lastMsg = prev[prev.length - 1];
    if (lastMsg && lastMsg.role === ROLES.AI) {
      return [...prev.slice(0, -1), { ...lastMsg, content }];
    }
    return [...prev, { role: ROLES.AI, content }];
  });
}

export function finalizeAssistantMessage(setMessages: SetChatMessages, content: string): void {
  setMessages((prev) => {
    const lastMsg = prev[prev.length - 1];
    if (lastMsg && lastMsg.role === ROLES.AI) {
      return [...prev.slice(0, -1), { ...lastMsg, content }];
    }
    return prev;
  });
}

export function createChatController(
  services: ChatControllerServices = defaultServices
): ChatController {
  let activeAbortController: AbortController | null = null;

  return {
    async sendMessage(options) {
      const message = options.input.trim();
      if (!message) {
        return { status: 'skipped-empty' };
      }

      options.addMessage(ROLES.USER, message);
      addSentryBreadcrumb('chat.send.accepted', { input_length: message.length });
      options.onAccepted?.(message);

      const abortController = createAbortController();
      activeAbortController = abortController;
      let hasReceivedChunk = false;

      try {
        const aiText = await services.sendMessageToAI(
          message,
          (partial) => {
            if (!hasReceivedChunk) {
              hasReceivedChunk = true;
              addSentryBreadcrumb('chat.send.first_chunk');
              options.onFirstChunk?.();
            }
            upsertAssistantMessage(options.setMessages, partial);
            options.onChunk?.(partial);
          },
          abortController ? { signal: abortController.signal } : undefined
        );

        finalizeAssistantMessage(options.setMessages, aiText);
        addSentryBreadcrumb('chat.send.complete', { response_length: aiText.length });
        options.onComplete?.(aiText);
        return { status: 'sent', response: aiText };
      } catch (error) {
        const err = toError(error);
        addSentryBreadcrumb('chat.send.error', { status: getErrorStatus(err) }, 'warning');
        options.addMessage(ROLES.AI, `Error: ${err.message}`);
        options.onError?.(err);
        return { status: 'error', error: err };
      } finally {
        if (activeAbortController === abortController) {
          activeAbortController = null;
        }
        options.onFinally?.();
      }
    },

    async resetHistory(options) {
      try {
        await services.resetChat();
        options.clearHistory();
        addSentryBreadcrumb('chat.reset.success');
        options.onSuccess?.();
        return { status: 'reset' };
      } catch (error) {
        const err = toError(error);
        const message = `${options.errorPrefix}: ${err.message}`;
        addSentryBreadcrumb('chat.reset.error', { status: getErrorStatus(err) }, 'warning');
        options.onError?.(message, err);
        return { status: 'error', error: err, message };
      } finally {
        options.onFinally?.();
      }
    },

    cancelActiveRequest() {
      if (!activeAbortController || activeAbortController.signal.aborted) {
        return false;
      }
      activeAbortController.abort();
      activeAbortController = null;
      addSentryBreadcrumb('chat.send.cancel');
      return true;
    },

    hasActiveRequest() {
      return Boolean(activeAbortController && !activeAbortController.signal.aborted);
    }
  };
}
