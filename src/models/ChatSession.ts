import { MAX_TOKENS, AVG_WORD_LENGTH, AVG_TOKENS_PER_WORD } from '../constants/index';
import type { ChatMessage, ChatRole } from '../types/chat';

class ChatSession {
  private history: ChatMessage[];

  constructor(initial: ChatMessage[] = []) {
    this.history = Array.isArray(initial) ? [...initial] : [];
    this.trimHistory();
  }

  private countTokens(msg: ChatMessage): number {
    return Math.ceil((msg.content.length / AVG_WORD_LENGTH) * AVG_TOKENS_PER_WORD);
  }

  private trimHistory(): void {
    let tokens = this.history.reduce((t, m) => t + this.countTokens(m), 0);
    while (tokens > MAX_TOKENS && this.history.length > 0) {
      this.history.shift();
      tokens = this.history.reduce((t, m) => t + this.countTokens(m), 0);
    }
  }

  addMessage(role: ChatRole, content: string): ChatMessage[] {
    this.history.push({ role, content });
    this.trimHistory();
    return this.getHistory();
  }

  setHistory(list: ChatMessage[]): void {
    this.history = Array.isArray(list) ? [...list] : [];
    this.trimHistory();
  }

  getHistory(): ChatMessage[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}

export default ChatSession;
