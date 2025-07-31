import { LocalizedSection } from '../ui';

export default function EnhancementProgress({ show, innerRef, textsZh, textsEn }) {
  if (!show) return null;
  return (
    <div id="enhancement-progress" className="fixed-bottom-right" ref={innerRef}>
      <div className="pulse-container">
        <div className="pulse-dot pulse-dot-1"></div>
        <div className="pulse-dot pulse-dot-2"></div>
        <div className="pulse-dot pulse-dot-3"></div>
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
