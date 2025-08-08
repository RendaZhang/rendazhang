import { describe, it, expect, vi } from 'vitest';

vi.mock('../../constants/index', () => ({
  MAX_TOKENS: 100,
  AVG_WORD_LENGTH: 4,
  AVG_TOKENS_PER_WORD: 1
}));

import ChatSession from '../ChatSession';
import type { ChatMessage } from '../../types/chat';

describe('ChatSession', () => {
  it('trims history when token limit is exceeded', () => {
    const session = new ChatSession();
    for (let i = 0; i < 10; i++) {
      session.addMessage('user', `msg${i}-` + 'a'.repeat(46));
    }
    const history = session.getHistory();
    expect(history).toHaveLength(7);
    expect(history[0].content.startsWith('msg3')).toBe(true);
    expect(history[history.length - 1].content.startsWith('msg9')).toBe(true);
  });

  it('setHistory, getHistory and clear manage history correctly', () => {
    const initial: ChatMessage[] = [
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'hi' }
    ];
    const session = new ChatSession();
    session.setHistory(initial);
    const retrieved = session.getHistory();
    expect(retrieved).toEqual(initial);
    expect(retrieved).not.toBe(initial);
    retrieved.push({ role: 'user', content: 'extra' });
    expect(session.getHistory()).toEqual(initial);
    session.clear();
    expect(session.getHistory()).toEqual([]);
  });
});
