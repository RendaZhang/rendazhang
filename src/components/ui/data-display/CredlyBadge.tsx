import { useEffect, useRef, useState, type ReactElement } from 'react';
import { CREDLY_BADGE_ID, CREDLY_EMBED_IFRAME, CREDLY_HOST } from '../../../constants';
import LocalizedSection from './LocalizedSection';

type LoadStatus = 'loading' | 'loaded' | 'error';

export default function CredlyBadge(): ReactElement {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  const iframeSrc = `${CREDLY_HOST}/embedded_badge/${CREDLY_BADGE_ID}`;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let done = false;

    const onLoad = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => setStatus('loaded'));
    };

    // 1) 先绑事件（只触发一次）
    iframe.addEventListener('load', onLoad, { once: true });

    // 2) 再设置 src，避免错过瞬时触发的 load
    if (!iframe.src || iframe.src === 'about:blank') {
      iframe.src = iframeSrc;
    }

    // 3) 超时兜底
    const t = setTimeout(() => {
      if (!done) setStatus('error');
    }, 20_000);

    // 4) 清理 & 可选地把 src 置回空白，打断缓存的 bfcache/快速复用
    return () => {
      clearTimeout(t);
      iframe.removeEventListener('load', onLoad);
      try {
        iframe.src = 'about:blank';
      } catch (err) {
        /* ignore */ void err;
      }
    };
  }, [iframeSrc, reloadKey]);

  const handleRetry = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setStatus('loading');
    try {
      iframe.src = 'about:blank';
    } catch {
      /* ignore */
    }
    // 让 effect 重新执行
    setReloadKey((n) => n + 1);
  };

  return (
    <div className={`c-credly-container${status === 'loaded' ? ' is-loaded' : ''}`}>
      {status === 'loading' && <div className="c-credly-skeleton" />}
      {status === 'error' && (
        <div className="c-credly-error">
          <LocalizedSection zhContent="加载失败，请重试" enContent="Load failed, please retry" />
          <button type="button" onClick={handleRetry}>
            <LocalizedSection zhContent="重试" enContent="Retry" />
          </button>
        </div>
      )}
      {/* 注意：此处不再通过 props 直接传 src，也不再用 onLoad */}
      <iframe
        ref={iframeRef}
        name="acclaim-badge"
        id={`embedded-badge-${CREDLY_BADGE_ID}`}
        title="View my verified achievement on Credly."
        style={{
          width: `${CREDLY_EMBED_IFRAME.WIDTH}px`,
          height: `${CREDLY_EMBED_IFRAME.HEIGHT}px`
        }}
      />
    </div>
  );
}
