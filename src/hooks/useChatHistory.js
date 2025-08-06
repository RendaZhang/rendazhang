import { useEffect, useRef, useState } from 'react';
import { STORAGE_KEY, ROLES } from '../constants/index';
import { storage } from '../utils/index';
import ChatSession from '../models/ChatSession.ts';

export default function useChatHistory() {
  const sessionRef = useRef(new ChatSession());
  const [messages, setMessagesState] = useState([]);

  useEffect(() => {
    const stored = storage.get(STORAGE_KEY) || [];
    const loaded = stored.map((m) => ({
      role: m.role === ROLES.ASSISTANT ? ROLES.AI : ROLES.USER,
      content: m.content
    }));
    sessionRef.current.setHistory(loaded);
    setMessagesState(sessionRef.current.getHistory());
  }, []);

  const save = (list) => {
    storage.set(
      STORAGE_KEY,
      list.map((m) => ({
        role: m.role === ROLES.AI ? ROLES.ASSISTANT : ROLES.USER,
        content: m.content
      }))
    );
  };

  const addMessage = (role, content) => {
    const list = sessionRef.current.addMessage(role, content);
    save(list);
    setMessagesState(sessionRef.current.getHistory());
    return list;
  };

  const saveMessages = (updater) => {
    const prev = sessionRef.current.getHistory();
    const list = typeof updater === 'function' ? updater(prev) : updater;
    sessionRef.current.setHistory(list);
    const saved = sessionRef.current.getHistory();
    save(saved);
    setMessagesState(saved);
    return saved;
  };

  const clearHistory = () => {
    sessionRef.current.clear();
    save([]);
    setMessagesState(sessionRef.current.getHistory());
  };

  return { messages, addMessage, setMessages: saveMessages, clearHistory };
}
