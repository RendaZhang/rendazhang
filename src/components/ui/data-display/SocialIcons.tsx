import { useState, useRef, useEffect, type ReactElement } from 'react';
import { SITE_BASE_URL, SOCIAL_ICON_PATHS, SOCIAL_LINKS, IMAGE_PATHS } from '../../../constants';

interface SocialIconProps {
  href: string;
  id?: string;
  src: string | { src: string; width?: number; height?: number };
  alt: string;
  ariaLabel?: string;
}

function SocialIcon({ href, id, src, alt, ariaLabel }: SocialIconProps): ReactElement {
  const [loaded, setLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const srcUrl = typeof src === 'string' ? src : src.src;
  const imgWidth = typeof src === 'object' ? src.width : undefined;
  const imgHeight = typeof src === 'object' ? src.height : undefined;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <a href={href} aria-label={ariaLabel} id={id}>
      {!loaded && <span className="c-spinner c-spinner-center" aria-hidden="true" />}
      <img
        ref={imgRef}
        src={srcUrl}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        loading="lazy"
        className={loaded ? 'loaded' : 'loading'}
        onLoad={() => setLoaded(true)}
      />
    </a>
  );
}

export default function SocialIcons(): ReactElement {
  return (
    <>
      <div className="c-social-icons" aria-label="Social Links">
        <SocialIcon
          href={SITE_BASE_URL}
          ariaLabel="WeChat Official Account"
          id="wechatLink"
          src={SOCIAL_ICON_PATHS.WECHAT}
          alt="WeChat logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.ZHIHU}
          ariaLabel="Zhihu"
          src={SOCIAL_ICON_PATHS.ZHIHU}
          alt="Zhihu logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.TOUTIAO}
          ariaLabel="Toutiao"
          src={SOCIAL_ICON_PATHS.TOUTIAO}
          alt="Toutiao logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.CSDN}
          ariaLabel="CSDN"
          src={SOCIAL_ICON_PATHS.CSDN}
          alt="CSDN logo"
        />
        <SocialIcon
          href={SOCIAL_LINKS.MEDIUM}
          ariaLabel="Medium"
          src={SOCIAL_ICON_PATHS.MEDIUM}
          alt="Medium logo"
        />
      </div>
      <div id="wechatModal" className="modal">
        <div className="modal-content bg-surface rounded-8">
          <span className="close">&times;</span>
          <div className="c-loader">
            <div className="c-dot"></div>
            <div className="c-dot"></div>
            <div className="c-dot"></div>
          </div>
          <img
            id="wechatQR"
            data-src={IMAGE_PATHS.WECHAT_QR}
            alt="WeChat Official Account QR code"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </>
  );
}
