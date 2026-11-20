import { useState, useEffect, type MouseEvent } from 'react';
import { useLanguage } from '../../providers/I18nProvider';
import ControlHint from '../data-display/ControlHint';

export default function BackToTopButton() {
  const { lang } = useLanguage();
  const label = lang.startsWith('zh') ? '返回顶部' : 'Back to top';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 300);
        frame = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      document.querySelector<HTMLElement>('.c-skip-link')?.focus({ preventScroll: true });
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  if (!visible) return null;

  return (
    <ControlHint label={label} side="left" className="c-back-to-top-anchor">
      <button
        type="button"
        className="c-back-to-top u-flex-center"
        aria-label={label}
        onClick={scrollToTop}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 19V5m-7 7 7-7 7 7" />
        </svg>
      </button>
    </ControlHint>
  );
}
