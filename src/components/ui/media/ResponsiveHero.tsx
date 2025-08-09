import { useState, useRef, useEffect, type ReactNode, type ReactElement } from 'react';

interface ResponsiveHeroProps {
  imageName?: string;
  imageMap?: Record<string, string>;
  imageWidths?: number[];
  imagePlaceholder?: { base64?: string; aspectRatio?: number };
  alt?: string;
  className?: string;
  children?: ReactNode;
}

export default function ResponsiveHero({
  imageName = 'main-hero',
  imageMap = {},
  imageWidths = [],
  imagePlaceholder = {},
  alt = 'hero',
  className = '',
  children
}: ResponsiveHeroProps): ReactElement {
  const placeholderBase64 = imagePlaceholder.base64
    ? `data:image/jpeg;base64,${imagePlaceholder.base64}`
    : '';
  const aspectRatio = imagePlaceholder.aspectRatio || 1.5;
  const [loaded, setLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      setLoaded(true);
    }
  }, []);

  const srcSetWebp = imageWidths
    .map((w) => `${imageMap[`hero-${imageName}-${w}w.webp`]} ${w}w`)
    .join(', ');
  const srcSetJpeg = imageWidths
    .map((w) => `${imageMap[`hero-${imageName}-${w}w.jpeg`]} ${w}w`)
    .join(', ');
  const fallbackSrc = imageMap[`hero-${imageName}-800w.jpeg`];

  return (
    <div
      className={`c-responsive-hero ${className}`}
      style={{ position: 'relative', width: '100%', paddingTop: `${100 / aspectRatio}%` }}
    >
      <img
        className={`c-responsive-hero-placeholder u-absolute-fill${loaded ? ' is-loaded' : ''}`}
        src={placeholderBase64}
        alt=""
        aria-hidden="true"
      />
      <picture>
        <source srcSet={srcSetWebp} sizes="100vw" type="image/webp" />
        <img
          ref={imgRef}
          className={`c-responsive-hero-img u-absolute-fill${loaded ? ' is-loaded' : ''}`}
          src={fallbackSrc}
          srcSet={srcSetJpeg}
          sizes="100vw"
          alt={alt}
          onLoad={() => setLoaded(true)}
        />
      </picture>
      <div className="c-responsive-hero-content u-absolute-fill u-flex-center">{children}</div>
    </div>
  );
}
