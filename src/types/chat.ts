export interface ChatUser {
  id: string;
  name: string;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export type ChatCallback = () => void;

export interface CopyTexts {
  copyLabel: string;
  copiedLabel: string;
}

export interface InputTexts {
  sendButton: string;
  resetButton: string;
}

export interface LocalizedTexts<T> {
  zh: T;
  en: T;
}
