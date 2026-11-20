import { useEffect, useRef, useState, type ReactElement } from 'react';
import LocalizedSection from '../../ui/data-display/LocalizedSection';

export interface ShowcasePlayerProps {
  step: number;
  total: number;
  onStep: (step: number) => void;
}

const STEP_INTERVAL_MS = 1050;

export default function ShowcasePlayer({ step, total, onStep }: ShowcasePlayerProps): ReactElement {
  const [playing, setPlaying] = useState(() => !document.hidden);
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
    setPlaying(true);
  }

  function replay() {
    onStep(1);
    setPlaying(!document.hidden);
  }

  const primary = playing ? { zh: '暂停', en: 'Pause' } : { zh: '继续', en: 'Resume' };

  return (
    <div
      className="c-showcase-controls"
      ref={controls}
      role="group"
      aria-labelledby="showcase-controls-label"
    >
      <p id="showcase-controls-label">
        <LocalizedSection zhContent="播放控制" enContent="Playback controls" />
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
      <button className="c-showcase-button c-showcase-replay" type="button" onClick={replay}>
        <span aria-hidden="true">↺ </span>
        <LocalizedSection zhContent="重玩" enContent="Replay" />
      </button>
    </div>
  );
}
