import { useEffect, useRef, useState, type IframeHTMLAttributes, type ReactElement } from 'react';
import { CREDLY_BADGE_ID, CREDLY_EMBED_IFRAME, CREDLY_HOST } from '../../../constants';
import LocalizedSection from './LocalizedSection';

type LoadStatus = 'loading' | 'loaded' | 'error';

export default function CredlyBadge(): ReactElement {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === 'loading' ? 'error' : prev));
    }, 10_000);

    try {
      if (iframe.contentDocument?.readyState === 'complete') {
        clearTimeout(timeout);
        setStatus('loaded');
      }
    } catch {
      // Cross-origin; rely on load event
    }

    return () => clearTimeout(timeout);
  }, []);

  const handleLoad = () => setStatus('loaded');

  const iframeSrc = `${CREDLY_HOST}/embedded_badge/${CREDLY_BADGE_ID}`;

  const iframeProps: IframeHTMLAttributes<HTMLIFrameElement> & {
    allowtransparency: string;
  } = {
    name: 'acclaim-badge',
    allowtransparency: 'true',
    id: `embedded-badge-${CREDLY_BADGE_ID}`,
    title: 'View my verified achievement on Credly.',
    src: iframeSrc,
    onLoad: handleLoad,
    style: {
      width: `${CREDLY_EMBED_IFRAME.WIDTH}px`,
      height: `${CREDLY_EMBED_IFRAME.HEIGHT}px`
    }
  };

  return (
    <div className={`c-credly-container${status === 'loaded' ? ' is-loaded' : ''}`}>
      {status === 'loading' && <div className="c-credly-skeleton" />}
      {status === 'error' && (
        <div className="c-credly-error">
          <LocalizedSection zhContent="加载失败，请重试" enContent="Load failed, please retry" />
        </div>
      )}
      <iframe ref={iframeRef} {...iframeProps}></iframe>
    </div>
  );
}
