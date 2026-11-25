type DocsRouteLocation = {
  route: string;
  station?: string;
  source: string;
};

export function initDocsRoute(): void {
  const plate = document.querySelector<HTMLElement>('.c-docs-plate');
  if (!plate) return;

  const modes = Array.from(plate.querySelectorAll<HTMLInputElement>('input[name="docs-route"]'));
  const stations = Array.from(
    plate.querySelectorAll<HTMLDetailsElement>('details[data-docs-node]')
  );
  const activeStation = () =>
    plate.querySelector<HTMLDetailsElement>('details[data-docs-node][open]');
  const stationRoute = (station: HTMLDetailsElement) =>
    station.closest<HTMLElement>('[data-docs-path]')?.dataset.docsPath;
  const selectRoute = (route?: string) => {
    const mode = modes.find(({ value }) => value === route);
    if (mode) mode.checked = true;
  };
  const reserveReadout = () => {
    const readout = activeStation()?.querySelector<HTMLElement>('.c-docs-node-note');
    plate.style.setProperty('--docs-readout-size', readout ? `${readout.offsetHeight}px` : '0px');
  };

  const restoreLocation = () => {
    const saved: DocsRouteLocation | undefined = history.state?.docsRoute;
    if (!saved) return;

    selectRoute(saved.route);
    const station = stations.find(({ dataset }) => dataset.docsNode === saved.station);
    const active = activeStation();
    if (active && active !== station) active.open = false;
    if (station) station.open = true;
    if (plate.hasAttribute('data-docs-readout')) reserveReadout();

    const source = document.getElementById(saved.source);
    const visibleSource = source?.getClientRects().length ? source : null;
    (visibleSource ?? station?.querySelector('summary'))?.focus();
  };

  const focusFragment = () => {
    const target = document.querySelector<HTMLElement>(':target');
    if (target?.id === 'docs-route-title') {
      (activeStation()?.querySelector('summary') ?? target).focus();
    } else if (target?.hasAttribute('data-docs-destination')) {
      target.focus({ preventScroll: true });
    }
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
      if (station.open) selectRoute(stationRoute(station));
    });
  }

  for (const mode of modes) {
    mode.addEventListener('change', () => {
      const active = activeStation();
      if (!active) return;
      const route = stationRoute(active);
      if (route !== 'shared' && route !== mode.value) active.open = false;
    });
  }

  plate.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    const link = (event.target as Element).closest<HTMLAnchorElement>('a[id]');
    const mode = modes.find(({ checked }) => checked);
    if (!link || !mode) return;
    const location: DocsRouteLocation = {
      route: mode.value,
      station: activeStation()?.dataset.docsNode,
      source: link.id
    };
    // Save on this history entry before leaving, including when the destination is another site.
    history.replaceState({ ...history.state, docsRoute: location }, '');
    if (link.getAttribute('href') === window.location.hash) focusFragment();
  });

  window.addEventListener('hashchange', focusFragment);
  window.addEventListener('popstate', restoreLocation);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) restoreLocation();
  });

  const initiallyOpen = activeStation();
  if (initiallyOpen) selectRoute(stationRoute(initiallyOpen));
  restoreLocation();
}
