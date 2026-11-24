const plate = document.querySelector<HTMLElement>('.c-docs-plate');

if (plate) {
  const modes = plate.querySelectorAll<HTMLInputElement>('input[name="docs-route"]');
  const stations = plate.querySelectorAll<HTMLDetailsElement>('details[data-docs-node]');
  const activeStation = () =>
    plate.querySelector<HTMLDetailsElement>('details[data-docs-node][open]');
  const reserveReadout = () => {
    const readout = activeStation()?.querySelector<HTMLElement>('.c-docs-node-note');
    plate.style.setProperty('--docs-readout-size', readout ? `${readout.offsetHeight}px` : '0px');
  };

  if (typeof ResizeObserver === 'function') {
    // Reserve space for the selected note below the map, while keeping every station in place.
    plate.dataset.docsReadout = '';
    const resize = new ResizeObserver(reserveReadout);
    plate.querySelectorAll('.c-docs-node-note').forEach((readout) => resize.observe(readout));
    reserveReadout();
  }

  for (const station of stations) {
    station.addEventListener('toggle', () => {
      if (plate.hasAttribute('data-docs-readout')) reserveReadout();
      if (!station.open) return;
      const route = station.closest<HTMLElement>('[data-docs-path]')?.dataset.docsPath;
      for (const mode of modes) {
        if (mode.value === route) mode.checked = true;
      }
    });
  }

  for (const mode of modes) {
    mode.addEventListener('change', () => {
      const active = activeStation();
      const route = active?.closest<HTMLElement>('[data-docs-path]')?.dataset.docsPath;
      if (active && route !== 'shared' && route !== mode.value) active.open = false;
    });
  }
}
