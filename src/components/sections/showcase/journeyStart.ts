import { SHOWCASE_COVER, SHOWCASE_STEPS } from '../../../content/showcaseContent';

type Playback = 'idle' | 'playing' | 'paused' | 'complete';
type Locale = 'en' | 'zh';

const STEP_INTERVAL_MS = 1050;
const TOTAL_STEPS = SHOWCASE_STEPS.length;
const RANGE_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown'
]);

const playbackCopy = {
  idle: {
    label: SHOWCASE_COVER.start,
    hint: { zh: '从起点播放模拟请求', en: 'Play the simulation from the start' },
    icon: 'M9 5l11 7-11 7Z'
  },
  playing: {
    label: { zh: '暂停', en: 'Pause' },
    hint: { zh: '停在当前一站', en: 'Hold at the current stop' },
    icon: 'M9 5v14m6-14v14'
  },
  paused: {
    label: { zh: '继续', en: 'Resume' },
    hint: { zh: '从当前一站继续播放', en: 'Continue from the current stop' },
    icon: 'M9 5l11 7-11 7Z'
  },
  complete: {
    label: { zh: '重玩', en: 'Replay' },
    hint: { zh: '回到起点再播放一次', en: 'Play again from the start' },
    icon: 'M19 9a7 7 0 1 0 1 5M19 4v5h-5'
  }
} as const;

function setBilingual(target: HTMLElement, copy: Record<Locale, string>): void {
  for (const locale of ['zh', 'en'] as const) {
    const text = target.querySelector<HTMLElement>(`.is-lang-${locale}`);
    if (text && text.textContent !== copy[locale]) text.textContent = copy[locale];
  }
}

function connectControlHint(anchor: HTMLElement): void {
  let hovered = false;
  let focused = false;
  let dismissed = false;
  const renderHint = () =>
    anchor.toggleAttribute('data-hint-open', !dismissed && (hovered || focused));
  anchor.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    dismissed = false;
    renderHint();
  });
  anchor.addEventListener('pointerleave', () => {
    hovered = false;
    renderHint();
  });
  anchor.addEventListener('focusin', (event) => {
    if (!(event.target instanceof HTMLElement) || !event.target.matches(':focus-visible')) return;
    focused = true;
    dismissed = false;
    renderHint();
  });
  anchor.addEventListener('focusout', () => {
    focused = false;
    renderHint();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !anchor.hasAttribute('data-hint-open')) return;
    dismissed = true;
    renderHint();
  });
}

function connectJourney(exhibit: HTMLElement): void {
  const actions = exhibit.querySelector<HTMLElement>('[data-journey-controls]');
  const primary = actions?.querySelector<HTMLButtonElement>('[data-journey-primary]');
  const primaryLabel = primary?.querySelector<HTMLElement>('[data-journey-primary-label]');
  const primaryIcon = primary?.querySelector<SVGPathElement>('[data-journey-icon]');
  const primaryHint = actions?.querySelector<HTMLElement>('[data-journey-primary-hint]');
  const next = actions?.querySelector<HTMLButtonElement>('[data-journey-next]');
  const scrubber = exhibit.querySelector<HTMLElement>('[data-journey-scrubber]');
  const range = scrubber?.querySelector<HTMLInputElement>('.c-showcase-range');
  const ticks = scrubber?.querySelectorAll<HTMLButtonElement>('[data-tick]');
  const counter = exhibit.querySelector<HTMLElement>('[data-journey-count]');
  const progress = exhibit.querySelector<HTMLElement>('.c-showcase-progress');
  const stages = exhibit.querySelectorAll<HTMLElement>('[data-stage]');
  const stations = exhibit.querySelectorAll<HTMLElement>('[data-station]');
  const question = exhibit.querySelector<HTMLElement>('.c-showcase-question');
  const reply = exhibit.querySelector<HTMLElement>('.c-showcase-live-reply');
  const pieces = exhibit.querySelectorAll<HTMLElement>('[data-reply-piece]');
  if (
    !actions ||
    !primary ||
    !primaryLabel ||
    !primaryIcon ||
    !primaryHint ||
    !next ||
    !scrubber ||
    !range ||
    !ticks ||
    !counter ||
    !progress ||
    !question ||
    !reply
  ) {
    return;
  }

  let playback: Playback = 'idle';
  let step = 0;
  let timer: number | undefined;
  let locale: Locale = 'zh';

  const renderActions = () => {
    const { label, hint, icon } = playbackCopy[playback];
    setBilingual(primaryLabel, label);
    setBilingual(primaryHint, hint);
    primaryIcon.setAttribute('d', icon);
    primary.setAttribute('aria-label', label[locale]);
    next.setAttribute('aria-disabled', String(playback === 'complete'));
  };

  const renderScrubber = () => {
    scrubber.dataset.value = String(step);
    range.valueAsNumber = step;
    const stage = SHOWCASE_STEPS[step - 1]?.[locale] ?? (locale === 'en' ? 'Start' : '起点');
    range.setAttribute('aria-valuetext', `${step}/${TOTAL_STEPS} · ${stage}`);
    ticks.forEach((tick) => {
      if (playback !== 'idle' && Number(tick.dataset.tick) === step) {
        tick.setAttribute('aria-current', 'step');
      } else {
        tick.removeAttribute('aria-current');
      }
    });
  };

  const syncLocale = () => {
    locale = document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
    actions.setAttribute('aria-label', locale === 'en' ? 'Playback controls' : '播放控制');
    next.setAttribute('aria-label', locale === 'en' ? 'Step' : '单步');
    ticks.forEach((tick, index) => {
      const stage = SHOWCASE_STEPS[index];
      if (!stage) return;
      const stop = index + 1;
      const label = locale === 'en' ? `Step ${stop}: ${stage.en}` : `第 ${stop} 步：${stage.zh}`;
      tick.setAttribute('aria-label', label);
      tick.title = label;
    });
    renderActions();
    renderScrubber();
  };

  const showStep = (value: number, immediate: boolean) => {
    step = value;
    exhibit.dataset.step = String(step);
    if (step === 0) delete exhibit.dataset.journeyFlow;
    else exhibit.dataset.journeyFlow = step < 4 ? 'outbound' : 'return';
    exhibit.toggleAttribute('data-seeking', immediate);
    const activeStation = SHOWCASE_STEPS[step - 1]?.node;

    counter.textContent = String(step);
    progress.hidden = false;
    stages.forEach((stage) => (stage.hidden = Number(stage.dataset.stage) !== step));
    stations.forEach((station) => {
      if (activeStation && station.dataset.station === activeStation) {
        station.setAttribute('aria-current', 'step');
      } else {
        station.removeAttribute('aria-current');
      }
    });
    question.hidden = step === 0;
    reply.hidden = step < 5;
    pieces.forEach((piece, index) => (piece.hidden = step < 5 + index));
    renderScrubber();
  };

  const setPlayback = (value: Playback) => {
    playback = value;
    exhibit.dataset.journeyState = value;
    renderActions();
  };

  const pause = () => {
    window.clearTimeout(timer);
    if (playback === 'playing') setPlayback('paused');
  };

  const scheduleAdvance = () => {
    timer = window.setTimeout(() => {
      if (playback !== 'playing') return;
      showStep(step + 1, false);
      if (step === TOTAL_STEPS) setPlayback('complete');
      else scheduleAdvance();
    }, STEP_INTERVAL_MS);
  };

  const start = () => {
    pause();
    setPlayback(document.hidden ? 'paused' : 'playing');
    showStep(1, false);
    if (!document.hidden) scheduleAdvance();
  };

  const seek = (value: number) => {
    if (!Number.isInteger(value) || value < 0 || value > TOTAL_STEPS) return;
    pause();
    setPlayback(value === 0 ? 'idle' : value === TOTAL_STEPS ? 'complete' : 'paused');
    showStep(value, true);
  };

  primary.addEventListener('click', () => {
    if (playback === 'idle' || playback === 'complete') {
      start();
    } else if (playback === 'playing') {
      pause();
    } else {
      setPlayback('playing');
      scheduleAdvance();
    }
  });

  next.addEventListener('click', () => {
    if (playback !== 'complete') seek(playback === 'idle' ? 1 : step + 1);
  });

  range.addEventListener('input', () => seek(range.valueAsNumber));
  range.addEventListener('pointerdown', pause);
  range.addEventListener('keydown', (event) => {
    if (RANGE_KEYS.has(event.key)) pause();
  });

  ticks.forEach((tick) => tick.addEventListener('click', () => seek(Number(tick.dataset.tick))));
  actions.querySelectorAll<HTMLElement>('[data-journey-hint-anchor]').forEach(connectControlHint);
  window.addEventListener('langChanged', syncLocale);

  setPlayback('idle');
  syncLocale();
  for (const control of [primary, next, range, ...ticks]) control.disabled = false;

  const resumeEarlyActivation = () => {
    if (window.location.hash === '#showcase-start' && playback === 'idle') start();
  };
  window.addEventListener('hashchange', resumeEarlyActivation);
  resumeEarlyActivation();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    }).observe(exhibit);
  }
}

document.querySelectorAll<HTMLElement>('.c-showcase').forEach(connectJourney);
