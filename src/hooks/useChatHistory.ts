import { useEffect, useRef, useState } from 'react';
import { STORAGE_KEY, ROLES } from '../constants/index';
import { storage } from '../utils/index';
import ChatSession, { type ChatMessage } from '../models/ChatSession.ts';

interface UseChatHistory {
  messages: ChatMessage[];
  addMessage: (role: string, content: string) => ChatMessage[];
  setMessages: (
    updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => ChatMessage[];
  clearHistory: () => void;
}

export default function useChatHistory(): UseChatHistory {
  const sessionRef = useRef<ChatSession>(new ChatSession());
  const [messages, setMessagesState] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const stored = (storage.get(STORAGE_KEY) || []) as ChatMessage[];
    const loaded = stored.map((m) => ({
      role: m.role === ROLES.ASSISTANT ? ROLES.AI : ROLES.USER,
      content: m.content
    }));
    sessionRef.current.setHistory(loaded);
    setMessagesState(sessionRef.current.getHistory());
  }, []);

  const save = (list: ChatMessage[]): void => {
    storage.set(
      STORAGE_KEY,
      list.map((m) => ({
        role: m.role === ROLES.AI ? ROLES.ASSISTANT : ROLES.USER,
        content: m.content
      }))
    );
  };

  const addMessage = (role: string, content: string): ChatMessage[] => {
    const list = sessionRef.current.addMessage(role, content);
    save(list);
    setMessagesState(sessionRef.current.getHistory());
    return list;
  };

  const saveMessages = (
    updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ): ChatMessage[] => {
    const prev = sessionRef.current.getHistory();
    const list = typeof updater === 'function' ? updater(prev) : updater;
    sessionRef.current.setHistory(list);
    const saved = sessionRef.current.getHistory();
    save(saved);
    setMessagesState(saved);
    return saved;
  };

  const clearHistory = (): void => {
    sessionRef.current.clear();
    save([]);
    setMessagesState(sessionRef.current.getHistory());
  };

  return { messages, addMessage, setMessages: saveMessages, clearHistory };
}
