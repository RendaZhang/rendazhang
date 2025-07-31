import { useState, useRef, useEffect } from 'react';

export default function ResponsiveHero({
  imageName = 'main-hero',
  imageMap = [],
  imageWidths = [],
  imagePlaceholder = {},
  alt = 'hero',
  className = '',
  children
}) {
  const placeholderBase64 = imagePlaceholder.base64
    ? `data:image/jpeg;base64,${imagePlaceholder.base64}`
    : '';
  const aspectRatio = imagePlaceholder.aspectRatio || 1.5;
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

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
      className={`responsive-hero ${className}`}
      style={{ position: 'relative', width: '100%', paddingTop: `${100 / aspectRatio}%` }}
    >
      <img
        className={`responsive-hero-placeholder absolute-fill${loaded ? ' loaded' : ''}`}
        src={placeholderBase64}
        alt=""
        aria-hidden="true"
      />
      <picture>
        <source srcSet={srcSetWebp} sizes="100vw" type="image/webp" />
        <img
          ref={imgRef}
          className={`responsive-hero-img absolute-fill${loaded ? ' loaded' : ''}`}
          src={fallbackSrc}
          srcSet={srcSetJpeg}
          sizes="100vw"
          alt={alt}
          onLoad={() => setLoaded(true)}
        />
      </picture>
      <div className="responsive-hero-content absolute-fill flex-center">{children}</div>
    </div>
  );
}
