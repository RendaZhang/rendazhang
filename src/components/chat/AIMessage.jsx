import { useState } from 'react';
import { useMarkdownPipeline } from '../../hooks';
import { UI_DURATIONS } from '../../config.js';
import { LocalizedSection } from '../ui';

export default function AIMessage({ text, enhance, onRendered, textsZh, textsEn }) {
  const [showBtn, setShowBtn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useMarkdownPipeline(text, enhance, onRendered);

  const handleCopy = (e) => {
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
      className="message ai-message markdown-body"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <button
        className="copy-btn rounded-4"
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
