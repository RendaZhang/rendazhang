import { useEffect, useRef, useState } from 'react';
import { CREDLY_HOST, CREDLY_BADGE_ID, CREDLY_EMBED_IFRAME, SCRIPT_PATHS } from '../config.js';

let scriptPromise;

function loadCredlyScript() {
  if (scriptPromise) return scriptPromise;
  const existing = document.querySelector(`script[src="${SCRIPT_PATHS.CREDLY_EMBED}"]`);
  if (existing) {
    scriptPromise = Promise.resolve();
    return scriptPromise;
  }
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_PATHS.CREDLY_EMBED;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.body.appendChild(s);
  });
  return scriptPromise;
}

export default function CredlyBadge() {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let observer;
    loadCredlyScript()
      .then(() => {
        const container = containerRef.current;
        if (!container) return;
        const hide = () => setLoaded(true);
        const handleIframe = (iframe) => {
          if (!iframe) return;
          if (iframe.complete) hide();
          else iframe.addEventListener('load', hide, { once: true });
        };
        const existing = container.querySelector('iframe');
        if (existing) {
          handleIframe(existing);
        } else {
          observer = new MutationObserver((muts) => {
            for (const m of muts) {
              for (const node of m.addedNodes) {
                if (node.tagName === 'IFRAME') {
                  handleIframe(node);
                  observer.disconnect();
                  return;
                }
              }
            }
          });
          observer.observe(container, { childList: true });
        }
      })
      .catch(() => setLoaded(true));
    return () => observer && observer.disconnect();
  }, []);

  return (
    <div className="credly-container" ref={containerRef}>
      {!loaded && <div className="loader"></div>}
      <div
        data-iframe-width={CREDLY_EMBED_IFRAME.WIDTH}
        data-iframe-height={CREDLY_EMBED_IFRAME.HEIGHT}
        data-share-badge-id={CREDLY_BADGE_ID}
        data-share-badge-host={CREDLY_HOST}
      ></div>
    </div>
  );
}
