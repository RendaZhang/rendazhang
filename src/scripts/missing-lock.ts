import { MISSING_LOCK_COPY } from '../content/missingLockContent';

const board = document.querySelector<HTMLElement>('[data-lock-case]');
const note = board?.querySelector<HTMLElement>('[data-lock-note]');
const awakened = board?.querySelector<HTMLButtonElement>('[data-lock-task="awakened"]');

if (board && note && awakened) {
  const modes = board.querySelectorAll<HTMLButtonElement>('[data-lock-mode]');
  const tasks = board.querySelectorAll<HTMLButtonElement>('[data-lock-select]');

  const updateNote = () => {
    const language = document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
    const copy = MISSING_LOCK_COPY[language];
    const recovered = board.dataset.mode === 'recovered';
    const selection = board.dataset.selection;

    if (selection === 'none') return;
    if (selection === 'awakened') {
      note.textContent = recovered ? copy.awakenedRecovered : copy.awakenedIncident;
    } else {
      note.textContent = recovered ? copy.laneRecovered : copy.laneIncident;
    }
  };

  modes.forEach((mode) => {
    mode.disabled = false;
    mode.addEventListener('click', () => {
      board.dataset.mode = mode.dataset.lockMode;
      awakened.dataset.position = mode.dataset.lockMode === 'recovered' ? 'lane-1' : 'queue';
      modes.forEach((button) => button.setAttribute('aria-pressed', String(button === mode)));
      updateNote();
    });
  });

  tasks.forEach((task) => {
    task.disabled = false;
    task.addEventListener('click', () => {
      board.dataset.selection = task.dataset.lockSelect;
      tasks.forEach((button) => button.setAttribute('aria-pressed', String(button === task)));
      updateNote();
    });
  });

  window.addEventListener('langChanged', updateNote);
}
