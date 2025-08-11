import { LocalizedSection } from '../ui';
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
  textsZh: InputTexts;
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
  textsZh,
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
          className="c-btn-primary c-btn-chat"
          onClick={onSend}
          disabled={disabled}
        >
          <LocalizedSection zhContent={textsZh.sendButton} enContent={textsEn.sendButton} />
        </button>
        <button
          id="reset-btn"
          className="c-btn-secondary c-btn-chat"
          onClick={onReset}
          disabled={disabled}
        >
          <LocalizedSection zhContent={textsZh.resetButton} enContent={textsEn.resetButton} />
        </button>
      </div>
    </div>
  );
}
