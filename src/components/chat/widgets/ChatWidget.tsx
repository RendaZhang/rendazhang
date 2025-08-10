import { useState, useEffect, useRef } from 'react';
import { CHAT_PAGE_PATH, STYLE_PATHS, AI_CHAT_WIDGET_TITLE, ICON_SIZES } from '../../../constants';

const loadedStyles = new Set<string>();

function loadStyle(href: string): void {
  if (loadedStyles.has(href) || document.querySelector(`link[href="${href}"]`)) {
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  loadedStyles.add(href);
}

interface IconProps {
  size?: number;
}

function RobotIcon({ size = ICON_SIZES.DEFAULT }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M12 3v4" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
      <path d="M5 19v2h14v-2" />
    </svg>
  );
}

function CloseIcon({ size = ICON_SIZES.DEFAULT }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface ChatWidgetProps {
  defaultOpen?: boolean;
}

export default function ChatWidget({ defaultOpen = false }: ChatWidgetProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [shouldLoad, setShouldLoad] = useState(defaultOpen);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadStyle(STYLE_PATHS.CHAT_WIDGET);
  }, []);

  const toggle = () => setOpen((o) => !o);

  useEffect(() => {
    if (open && !shouldLoad) {
      setShouldLoad(true);
    }
    if (!open) {
      setIframeLoaded(false);
    }
  }, [open, shouldLoad]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.source === iframeRef.current?.contentWindow &&
        event.data?.type === 'chat-page-ready'
      ) {
        setIframeLoaded(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      {open && (
        <div ref={panelRef} className="c-chat-widget-panel bg-surface rounded-8 shadow-medium">
          {shouldLoad && (
            <div className="c-chat-widget-frame-wrapper" aria-busy={!iframeLoaded}>
              <iframe
                ref={iframeRef}
                src={`${CHAT_PAGE_PATH}/`}
                title={AI_CHAT_WIDGET_TITLE}
                className={`c-chat-widget-iframe ${iframeLoaded ? 'is-loaded' : ''}`}
                loading="lazy"
              />
              {!iframeLoaded && <div className="c-chat-widget-skeleton" aria-hidden="true" />}
            </div>
          )}
        </div>
      )}
      <button
        ref={buttonRef}
        className="c-chat-widget-toggle u-flex-center shadow-medium u-fixed-bottom-right"
        onClick={toggle}
        aria-label={open ? 'Close Assistant' : 'Open Assistant'}
      >
        {open ? <CloseIcon size={ICON_SIZES.LARGE} /> : <RobotIcon size={ICON_SIZES.LARGE} />}
      </button>
    </>
  );
}
