import { MAX_TOKENS, AVG_WORD_LENGTH, AVG_TOKENS_PER_WORD } from '../constants/index.js';

class ChatSession {
  constructor(initial = []) {
    this.history = Array.isArray(initial) ? [...initial] : [];
    this.trimHistory();
  }

  countTokens(msg) {
    return Math.ceil((msg.content.length / AVG_WORD_LENGTH) * AVG_TOKENS_PER_WORD);
  }

  trimHistory() {
    let tokens = this.history.reduce((t, m) => t + this.countTokens(m), 0);
    while (tokens > MAX_TOKENS && this.history.length > 0) {
      this.history.shift();
      tokens = this.history.reduce((t, m) => t + this.countTokens(m), 0);
    }
  }

  addMessage(role, content) {
    this.history.push({ role, content });
    this.trimHistory();
    return this.getHistory();
  }

  setHistory(list) {
    this.history = Array.isArray(list) ? [...list] : [];
    this.trimHistory();
  }

  getHistory() {
    return [...this.history];
  }

  clear() {
    this.history = [];
  }
}

export default ChatSession;
