import { LocalizedSection } from '../ui';

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
}) {
  return (
    <div className="input-area">
      <textarea
        id="message-input"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows="1"
        autoFocus
      ></textarea>
      <div className="btn-container">
        <button id="send-btn" onClick={onSend} disabled={disabled}>
          <LocalizedSection zhContent={textsZh.sendButton} enContent={textsEn.sendButton} />
        </button>
        <button id="reset-btn" onClick={onReset} disabled={disabled}>
          <LocalizedSection zhContent={textsZh.resetButton} enContent={textsEn.resetButton} />
        </button>
      </div>
    </div>
  );
}
