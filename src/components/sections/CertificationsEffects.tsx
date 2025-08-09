import { useEffect } from 'react';

export default function CertificationsEffects(): null {
  useEffect(() => {
    const container = document.querySelector('.c-credly-container');
    if (!(container instanceof HTMLElement)) return;
    const loader = container.querySelector('.c-credly-spinner') as HTMLElement | null;

    const hide = (): void => {
      if (loader) loader.style.display = 'none';
    };

    const existing = container.querySelector<HTMLIFrameElement>('iframe');
    let observer: MutationObserver | undefined;
    if (existing) {
      existing.addEventListener('load', hide, { once: true });
    } else {
      observer = new MutationObserver((muts) => {
        for (const m of muts) {
          for (const node of Array.from(m.addedNodes)) {
            if (node instanceof HTMLIFrameElement) {
              node.addEventListener('load', hide, { once: true });
              observer!.disconnect();
              return;
            }
          }
        }
      });
      observer.observe(container, { childList: true });
    }
    return () => observer?.disconnect();
  }, []);

  return null;
}
