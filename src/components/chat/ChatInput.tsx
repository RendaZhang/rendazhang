import type { ChatCallback, InputTexts } from '../../types/chat';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: ChatCallback;
  onReset: ChatCallback;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  placeholder: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  textsEn: InputTexts;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onReset,
  onKeyDown,
  disabled,
  placeholder,
  inputRef,
  textsEn
}: ChatInputProps) {
  return (
    <div className="c-input-area">
      <textarea
        className="c-message-input"
        ref={inputRef}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        autoFocus
      ></textarea>
      <div className="c-btn-container">
        <button
          id="send-btn"
          className="c-btn-primary c-btn-chat c-send-btn"
          onClick={onSend}
          disabled={disabled}
          aria-label={textsEn.sendButton}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
        <button
          id="reset-btn"
          className="c-btn-secondary c-btn-chat c-reset-btn"
          onClick={onReset}
          disabled={disabled}
          aria-label={textsEn.resetButton}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
