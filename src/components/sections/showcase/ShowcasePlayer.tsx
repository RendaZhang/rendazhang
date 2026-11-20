import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { SHOWCASE_STEPS } from '../../../content/showcaseContent';
import LocalizedSection from '../../ui/data-display/LocalizedSection';

export interface ShowcasePlayerProps {
  step: number;
  total: number;
  onStep: (step: number, immediate?: boolean) => void;
}

const STEP_INTERVAL_MS = 1050;

export default function ShowcasePlayer({ step, total, onStep }: ShowcasePlayerProps): ReactElement {
  const [playing, setPlaying] = useState(() => !document.hidden);
  const controls = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const complete = step === total;
  const pause = useCallback(() => {
    window.clearTimeout(timer.current);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || complete) return;

    const pauseIfHidden = () => {
      if (document.hidden) pause();
    };
    document.addEventListener('visibilitychange', pauseIfHidden);
    const exhibit = controls.current?.closest('.c-showcase');
    const observer = exhibit
      ? new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) pause();
        })
      : undefined;
    if (exhibit) observer?.observe(exhibit);

    return () => {
      document.removeEventListener('visibilitychange', pauseIfHidden);
      observer?.disconnect();
    };
  }, [playing, complete, pause]);

  useEffect(() => {
    if (!playing || complete) return;

    const scheduled = window.setTimeout(() => {
      onStep(step + 1);
      if (step + 1 === total) setPlaying(false);
    }, STEP_INTERVAL_MS);
    timer.current = scheduled;
    return () => window.clearTimeout(scheduled);
  }, [playing, complete, onStep, step, total]);

  function togglePlayback() {
    if (complete) return;
    if (playing) {
      pause();
      return;
    }
    setPlaying(true);
  }

  function replay() {
    onStep(1);
    setPlaying(!document.hidden);
  }

  function seek(next: number) {
    pause();
    onStep(next, true);
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
      <ShowcaseScrubber step={step} onPause={pause} onSeek={seek} />
    </div>
  );
}

interface ShowcaseScrubberProps {
  step: number;
  onPause: () => void;
  onSeek: (step: number) => void;
}

function getLocale(): 'zh' | 'en' {
  return document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
}

function ShowcaseScrubber({ step, onPause, onSeek }: ShowcaseScrubberProps): ReactElement {
  const [locale, setLocale] = useState(getLocale);
  const total = SHOWCASE_STEPS.length;

  useEffect(() => {
    const syncLocale = () => setLocale(getLocale());
    window.addEventListener('langChanged', syncLocale);
    syncLocale();
    return () => window.removeEventListener('langChanged', syncLocale);
  }, []);

  return (
    <div className="c-showcase-scrubber" data-value={step}>
      <label className="c-showcase-scrub-label" htmlFor="showcase-scrubber">
        <LocalizedSection zhContent="旅程轨道" enContent="Journey track" />
      </label>
      <div className="c-showcase-scrub-rail">
        <input
          className="c-showcase-range"
          id="showcase-scrubber"
          type="range"
          min={1}
          max={total}
          step={1}
          value={step}
          aria-valuetext={`${step}/${total} · ${SHOWCASE_STEPS[step - 1][locale]}`}
          onPointerDown={onPause}
          onKeyDown={(event) => {
            if (
              event.key.startsWith('Arrow') ||
              ['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)
            ) {
              onPause();
            }
          }}
          onChange={(event) => onSeek(event.currentTarget.valueAsNumber)}
        />
        <span className="c-showcase-range-thumb" aria-hidden="true" />
      </div>
      <ol className="c-showcase-ticks">
        {SHOWCASE_STEPS.map((stage, index) => {
          const stop = index + 1;
          return (
            <li key={stage.en}>
              <button
                className="c-showcase-tick"
                type="button"
                data-tick={stop}
                aria-current={step === stop ? 'step' : undefined}
                aria-label={
                  locale === 'zh' ? `第 ${stop} 步：${stage.zh}` : `Step ${stop}: ${stage.en}`
                }
                onClick={() => onSeek(stop)}
              >
                {stop}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
