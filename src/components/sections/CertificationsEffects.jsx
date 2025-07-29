import { useEffect } from 'react';

export default function CertificationsEffects() {
  useEffect(() => {
    const container = document.querySelector('.credly-container');
    if (!container) return;
    const loader = container.querySelector('.loader');

    const hide = () => {
      if (loader) loader.style.display = 'none';
    };

    const existing = container.querySelector('iframe');
    let observer;
    if (existing) {
      existing.addEventListener('load', hide, { once: true });
    } else {
      observer = new MutationObserver((muts) => {
        for (const m of muts) {
          for (const node of m.addedNodes) {
            if (node.tagName === 'IFRAME') {
              node.addEventListener('load', hide, { once: true });
              observer.disconnect();
              return;
            }
          }
        }
      });
      observer.observe(container, { childList: true });
    }
    return () => observer && observer.disconnect();
  }, []);

  return null;
}
