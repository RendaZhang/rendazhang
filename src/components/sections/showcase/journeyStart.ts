function connectJourney(exhibit: HTMLElement): void {
  const start = exhibit.querySelector<HTMLAnchorElement>('.c-showcase-explore');
  const controls = exhibit.querySelector<HTMLElement>('[data-journey-controls]');
  const counter = exhibit.querySelector<HTMLElement>('[data-journey-count]');
  const progress = exhibit.querySelector<HTMLElement>('.c-showcase-progress');
  const stages = exhibit.querySelectorAll<HTMLElement>('[data-stage]');
  const reply = exhibit.querySelector<HTMLElement>('.c-showcase-live-reply');
  const pieces = exhibit.querySelectorAll<HTMLElement>('[data-reply-piece]');
  const loading = exhibit.querySelector<HTMLElement>('[data-journey-loading]');
  const error = exhibit.querySelector<HTMLElement>('[data-journey-error]');
  if (!start || !controls || !counter || !progress || !reply || !loading || !error) return;

  const showStep = (step: number) => {
    exhibit.dataset.step = String(step);
    counter.textContent = String(step);
    progress.hidden = false;
    stages.forEach((stage) => (stage.hidden = Number(stage.dataset.stage) !== step));
    reply.hidden = step < 5;
    pieces.forEach((piece, index) => (piece.hidden = step < 5 + index));
  };

  let restart: (() => void) | undefined;
  let pending = false;

  const depart = async () => {
    if (pending) return;
    showStep(1);
    if (restart) {
      restart();
      return;
    }

    pending = true;
    loading.hidden = false;
    error.hidden = true;
    try {
      const { mountRequestJourney } = await import('./RequestJourney');
      restart = mountRequestJourney(controls, showStep, () => (loading.hidden = true));
    } catch {
      loading.hidden = true;
      error.hidden = false;
    } finally {
      pending = false;
    }
  };

  start.addEventListener('click', (event) => {
    if (event.button || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    void depart();
  });

  const resumeEarlyActivation = () => {
    if (window.location.hash === '#showcase-start' && !exhibit.dataset.step) void depart();
  };
  window.addEventListener('hashchange', resumeEarlyActivation);
  resumeEarlyActivation();
}

document.querySelectorAll<HTMLElement>('.c-showcase').forEach(connectJourney);
