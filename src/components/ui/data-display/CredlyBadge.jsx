import { useEffect, useRef, useState } from 'react';
import { CREDLY_HOST, CREDLY_BADGE_ID, CREDLY_EMBED_IFRAME } from '../../../config.js';

export default function CredlyBadge() {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const handle = () => setLoaded(true);
    if (iframe.complete) {
      handle();
    } else {
      iframe.addEventListener('load', handle, { once: true });
      return () => iframe.removeEventListener('load', handle);
    }
  }, []);

  const iframeSrc = `${CREDLY_HOST}/embedded_badge/${CREDLY_BADGE_ID}`;

  return (
    <div className="credly-container">
      {!loaded && <div className="spinner spinner-center credly-spinner"></div>}
      <iframe
        ref={iframeRef}
        name="acclaim-badge"
        allowtransparency="true"
        id={`embedded-badge-${CREDLY_BADGE_ID}`}
        title="View my verified achievement on Credly."
        src={iframeSrc}
        style={{
          width: `${CREDLY_EMBED_IFRAME.WIDTH}px`,
          height: `${CREDLY_EMBED_IFRAME.HEIGHT}px`
        }}
      ></iframe>
    </div>
  );
}
