import { useState, useEffect } from 'react';
import { CHAT_PAGE_PATH } from '../config.js';

const loadedStyles = new Set();

function loadStyle(href) {
  if (loadedStyles.has(href) || document.querySelector(`link[href="${href}"]`)) {
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  loadedStyles.add(href);
}

function RobotIcon({ size = 24 }) {
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

function CloseIcon({ size = 24 }) {
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

export default function ChatWidget({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [loaded, setLoaded] = useState(defaultOpen);

  useEffect(() => {
    loadStyle('/css/chat_widget.css');
  }, []);

  const toggle = () => setOpen((o) => !o);

  useEffect(() => {
    if (open && !loaded) {
      setLoaded(true);
    }
  }, [open, loaded]);

  return (
    <>
      {open && (
        <div className="chat-widget-panel">
          {loaded && (
            <iframe
              src={`${CHAT_PAGE_PATH}/`}
              title="AI Chat"
              className="chat-widget-iframe"
              loading="lazy"
            />
          )}
        </div>
      )}
      <button
        className="chat-widget-toggle"
        onClick={toggle}
        aria-label={open ? 'Close Assistant' : 'Open Assistant'}
      >
        {open ? <CloseIcon size={28} /> : <RobotIcon size={28} />}
      </button>
    </>
  );
}
