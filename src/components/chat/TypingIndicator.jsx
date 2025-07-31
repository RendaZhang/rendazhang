export default function TypingIndicator({ innerRef }) {
  return (
    <div className="typing-indicator" id="typing-indicator" ref={innerRef}>
      <span className="typing-dot"></span>
      <span className="typing-dot"></span>
      <span className="typing-dot"></span>
    </div>
  );
}
