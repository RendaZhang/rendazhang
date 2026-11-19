import { useEffect, useRef, useState, type ReactElement } from 'react';
import LocalizedSection from '../../ui/data-display/LocalizedSection';

export interface ShowcasePlayerProps {
  step: number;
  total: number;
  onStep: (step: number) => void;
}

const STEP_INTERVAL_MS = 1050;

export default function ShowcasePlayer({ step, total, onStep }: ShowcasePlayerProps): ReactElement {
  const [playing, setPlaying] = useState(false);
  const controls = useRef<HTMLDivElement>(null);
  const complete = step === total;

  useEffect(() => {
    if (!playing || complete) return;

    const pauseIfHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', pauseIfHidden);
    const exhibit = controls.current?.closest('.c-showcase');
    const observer = exhibit
      ? new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) setPlaying(false);
        })
      : undefined;
    if (exhibit) observer?.observe(exhibit);

    return () => {
      document.removeEventListener('visibilitychange', pauseIfHidden);
      observer?.disconnect();
    };
  }, [playing, complete]);

  useEffect(() => {
    if (!playing || complete) return;

    const timer = window.setTimeout(() => {
      onStep(step + 1);
      if (step + 1 === total) setPlaying(false);
    }, STEP_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [playing, complete, onStep, step, total]);

  function togglePlayback() {
    if (complete) return;
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step === 0) onStep(1);
    setPlaying(true);
  }

  function reset() {
    setPlaying(false);
    onStep(0);
  }

  const primary = playing
    ? { zh: '暂停', en: 'Pause' }
    : step === 0 || complete
      ? { zh: '开始', en: 'Start' }
      : { zh: '继续', en: 'Resume' };

  return (
    <div
      className="c-showcase-controls"
      ref={controls}
      role="group"
      aria-labelledby="showcase-controls-label"
    >
      <p id="showcase-controls-label">
        <LocalizedSection zhContent="模拟演示" enContent="Simulated demo" />
      </p>
      <button
        className="c-showcase-button c-showcase-play"
        type="button"
        aria-disabled={complete}
        onClick={togglePlayback}
      >
        <LocalizedSection zhContent={primary.zh} enContent={primary.en} />
      </button>
      <button
        className="c-showcase-button c-showcase-next"
        type="button"
        disabled={playing || complete}
        onClick={() => onStep(step + 1)}
      >
        <LocalizedSection zhContent="单步" enContent="Step" />
      </button>
      <button
        className="c-showcase-button"
        type="button"
        aria-disabled={step === 0}
        onClick={reset}
      >
        <LocalizedSection zhContent="重置" enContent="Reset" />
      </button>
    </div>
  );
}
