import {
  useEffect,
  useRef,
  useState,
  type IframeHTMLAttributes,
  type ReactElement
} from 'react';
import {
  CREDLY_HOST,
  CREDLY_BADGE_ID,
  CREDLY_EMBED_IFRAME
} from '../../../constants/index.ts';

export default function CredlyBadge(): ReactElement {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const handle = () => setLoaded(true);
    if ((iframe as any).complete) {
      handle();
    } else {
      iframe.addEventListener('load', handle, { once: true });
      return () => iframe.removeEventListener('load', handle);
    }
  }, []);

  const iframeSrc = `${CREDLY_HOST}/embedded_badge/${CREDLY_BADGE_ID}`;

  const iframeProps: IframeHTMLAttributes<HTMLIFrameElement> & {
    allowtransparency: string;
  } = {
    name: 'acclaim-badge',
    allowtransparency: 'true',
    id: `embedded-badge-${CREDLY_BADGE_ID}`,
    title: 'View my verified achievement on Credly.',
    src: iframeSrc,
    style: {
      width: `${CREDLY_EMBED_IFRAME.WIDTH}px`,
      height: `${CREDLY_EMBED_IFRAME.HEIGHT}px`
    }
  };

  return (
    <div className="credly-container">
      {!loaded && <div className="spinner spinner-center credly-spinner"></div>}
      <iframe ref={iframeRef} {...iframeProps}></iframe>
    </div>
  );
}
