import { MISSING_LOCK_COPY } from '../content/missingLockContent';

const board = document.querySelector<HTMLElement>('[data-lock-case]');
const label = board?.querySelector<HTMLElement>('[data-lock-note-label]');
const note = board?.querySelector<HTMLElement>('[data-lock-note-text]');
const awakened = board?.querySelector<HTMLButtonElement>('[data-lock-task="awakened"]');

if (board && label && note && awakened) {
  const modes = board.querySelectorAll<HTMLButtonElement>('[data-lock-mode]');
  const clues = board.querySelectorAll<HTMLButtonElement>('[data-lock-select]');

  const currentClue = () => {
    if (board.dataset.mode === 'recovered') return 'recovered';
    switch (board.dataset.selection) {
      case 'none':
        return 'symptom';
      case 'lock':
        return 'holder';
      case 'awakened':
        return 'task';
      default:
        return 'thread';
    }
  };

  const updateNote = () => {
    const language = document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
    const clue = MISSING_LOCK_COPY[language].clues[currentClue()];
    label.textContent = clue.label;
    note.textContent = clue.text;
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

  clues.forEach((clue) => {
    clue.disabled = false;
    clue.addEventListener('click', () => {
      const selection = clue.dataset.lockSelect;
      board.dataset.selection = selection;
      board.toggleAttribute('data-thread-checked', true);
      if (selection === 'lock') board.dataset.owner = 'none';
      if (selection === 'awakened') board.toggleAttribute('data-task-checked', true);
      clues.forEach((button) => button.setAttribute('aria-pressed', String(button === clue)));
      updateNote();
    });
  });

  window.addEventListener('langChanged', updateNote);
  updateNote();
}
