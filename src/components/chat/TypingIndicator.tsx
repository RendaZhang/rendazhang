import type { RefObject } from 'react';

interface TypingIndicatorProps {
  innerRef: RefObject<HTMLDivElement | null>;
}

export default function TypingIndicator({ innerRef }: TypingIndicatorProps) {
  return (
    <div className="typing-indicator" id="typing-indicator" ref={innerRef}>
      <span className="typing-dot"></span>
      <span className="typing-dot"></span>
      <span className="typing-dot"></span>
    </div>
  );
}
