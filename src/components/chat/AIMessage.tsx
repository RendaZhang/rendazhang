import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useMarkdownPipeline } from '../../hooks';
import { UI_DURATIONS } from '../../constants';
import ControlHint from '../ui/data-display/ControlHint';
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

interface CopyFeedback {
  result: 'copied' | 'failed';
  repeated: boolean;
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
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);
  const latestCopyAttempt = useRef(0);
  const previousCopyFeedback = useRef<CopyFeedback | null>(null);
  const feedbackTimer = useRef<number | undefined>(undefined);
  const contentRef = useMarkdownPipeline(text, enhance, onRendered);
  const isCopied = copyFeedback?.result === 'copied';
  const copyFailed = copyFeedback?.result === 'failed';
  const feedbackLabel = isCopied ? texts.copiedLabel : copyFailed ? texts.copyFailedLabel : '';

  useEffect(
    () => () => {
      latestCopyAttempt.current += 1;
      window.clearTimeout(feedbackTimer.current);
    },
    []
  );

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const attempt = ++latestCopyAttempt.current;
    window.clearTimeout(feedbackTimer.current);
    setCopyFeedback((current) => (current?.result === 'copied' ? null : current));

    let result: CopyFeedback['result'];
    try {
      await navigator.clipboard.writeText(text);
      result = 'copied';
    } catch {
      result = 'failed';
    }
    if (attempt !== latestCopyAttempt.current) return;

    const previous = previousCopyFeedback.current;
    const nextFeedback = { result, repeated: previous?.result === result && !previous.repeated };
    previousCopyFeedback.current = nextFeedback;
    setCopyFeedback(nextFeedback);
    if (result === 'copied') {
      feedbackTimer.current = window.setTimeout(
        () => setCopyFeedback(null),
        UI_DURATIONS.COPY_FEEDBACK
      );
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
        <span className="c-copy-status" data-copy-result={copyFeedback?.result} role="status">
          {feedbackLabel}
          {/* Repeated feedback must change the live region's text to be announced again. */}
          {copyFeedback?.repeated ? '\u00a0' : ''}
        </span>
        <ControlHint disabled={copyFeedback !== null} label={texts.copyLabel} side="above">
          <button
            type="button"
            className="c-copy-btn rounded-4"
            aria-label={texts.copyLabel}
            data-copied={isCopied ? '' : undefined}
            data-copy-failed={copyFailed ? '' : undefined}
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
      </div>
    </div>
  );
}
