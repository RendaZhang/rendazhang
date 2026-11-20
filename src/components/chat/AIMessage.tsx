import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useMarkdownPipeline } from '../../hooks';
import { UI_DURATIONS } from '../../constants';
import ControlHint from '../ui/data-display/ControlHint';
import { logger } from '../../utils';
import type { ChatCallback, CopyTexts } from '../../types/chat';
import type { ChatGuideSourceHintGroup } from '../../content/chatGuideKnowledge';
import ChatGuideSourceHints from './ChatGuideSourceHints';

interface AIMessageProps {
  text: string;
  enhance: boolean;
  onRendered?: ChatCallback;
  texts: CopyTexts;
  sourceHints?: ChatGuideSourceHintGroup;
  sourceHintsHeading: string;
  sourceHintsAriaLabel: string;
}

export default function AIMessage({
  text,
  enhance,
  onRendered,
  texts,
  sourceHints,
  sourceHintsHeading,
  sourceHintsAriaLabel
}: AIMessageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const feedbackTimer = useRef<number | undefined>(undefined);
  const contentRef = useMarkdownPipeline(text, enhance, onRendered);

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      window.clearTimeout(feedbackTimer.current);
      setIsCopied(true);
      feedbackTimer.current = window.setTimeout(
        () => setIsCopied(false),
        UI_DURATIONS.COPY_FEEDBACK
      );
    } catch (error) {
      logger.error('Clipboard copy failed:', error);
    }
  };

  return (
    <div className="c-message c-ai-message c-markdown-body">
      <div className="c-ai-message-content" ref={contentRef}></div>
      <ChatGuideSourceHints
        ariaLabel={sourceHintsAriaLabel}
        heading={sourceHintsHeading}
        sourceHints={sourceHints}
      />
      <div className="c-message-actions">
        <ControlHint label={isCopied ? texts.copiedLabel : texts.copyLabel} side="above">
          <button
            type="button"
            className="c-copy-btn rounded-4"
            aria-label={texts.copyLabel}
            data-copied={isCopied ? '' : undefined}
            onClick={handleCopy}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              {isCopied ? (
                <path d="m5 12 4 4L19 6" />
              ) : (
                <>
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </>
              )}
            </svg>
          </button>
        </ControlHint>
        <span className="c-copy-status" role="status">
          {isCopied ? texts.copiedLabel : ''}
        </span>
      </div>
    </div>
  );
}
