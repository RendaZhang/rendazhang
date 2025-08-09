import type { RefObject } from 'react';

interface TypingIndicatorProps {
  innerRef: RefObject<HTMLDivElement | null>;
}

export default function TypingIndicator({ innerRef }: TypingIndicatorProps) {
  return (
    <div className="c-typing-indicator" id="typing-indicator" ref={innerRef}>
      <span className="c-typing-dot"></span>
      <span className="c-typing-dot"></span>
      <span className="c-typing-dot"></span>
    </div>
  );
}
