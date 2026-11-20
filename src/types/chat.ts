import { ROLES } from '../constants/settings';

export interface ChatUser {
  id: string;
  name: string;
}

export type ChatRole = (typeof ROLES)[keyof typeof ROLES];

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type ChatCallback = () => void;

export interface CopyTexts {
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
}

export interface InputTexts {
  sendButton: string;
  resetButton: string;
}

export interface LocalizedTexts<T> {
  zh: T;
  en: T;
}
