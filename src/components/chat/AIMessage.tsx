import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useMarkdownPipeline } from '../../hooks';
import { UI_DURATIONS } from '../../constants';
import { LocalizedSection } from '../ui';
import type { ChatCallback, CopyTexts } from '../../types/chat';

interface AIMessageProps {
  text: string;
  enhance: boolean;
  onRendered?: ChatCallback;
  textsZh: CopyTexts;
  textsEn: CopyTexts;
}

export default function AIMessage({ text, enhance, onRendered, textsZh, textsEn }: AIMessageProps) {
  const [showBtn, setShowBtn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useMarkdownPipeline(text, enhance, onRendered);

  const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        setShowBtn(false);
      }, UI_DURATIONS.COPY_FEEDBACK);
    });
  };

  const handleMouseEnter = () => setShowBtn(true);
  const handleMouseLeave = () => {
    if (!isCopied) setShowBtn(false);
  };
  const handleClick = () => setShowBtn(true);

  return (
    <div
      className="c-message c-ai-message c-markdown-body"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <button
        className="c-copy-btn rounded-4"
        onClick={handleCopy}
        style={{ display: showBtn ? 'inline-block' : 'none' }}
      >
        {isCopied ? (
          <LocalizedSection zhContent={textsZh.copiedLabel} enContent={textsEn.copiedLabel} />
        ) : (
          <LocalizedSection zhContent={textsZh.copyLabel} enContent={textsEn.copyLabel} />
        )}
      </button>
      <div ref={contentRef}></div>
    </div>
  );
}
