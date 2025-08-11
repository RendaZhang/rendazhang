import { LocalizedSection } from '../ui';
import type { RefObject } from 'react';

interface EnhancementTexts {
  enhancementProgress: string;
}

interface EnhancementProgressProps {
  show: boolean;
  innerRef: RefObject<HTMLDivElement | null>;
  textsZh: EnhancementTexts;
  textsEn: EnhancementTexts;
}

export default function EnhancementProgress({
  show,
  innerRef,
  textsZh,
  textsEn
}: EnhancementProgressProps) {
  if (!show) return null;
  return (
    <div className="c-enhancement-progress fixed-bottom-right" ref={innerRef}>
      <div className="c-pulse-container">
        <div className="c-pulse-dot c-pulse-dot-1"></div>
        <div className="c-pulse-dot c-pulse-dot-2"></div>
        <div className="c-pulse-dot c-pulse-dot-3"></div>
      </div>
      <p>
        <LocalizedSection
          zhContent={textsZh.enhancementProgress}
          enContent={textsEn.enhancementProgress}
        />
      </p>
    </div>
  );
}
