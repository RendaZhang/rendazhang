import { useState, useEffect } from 'react';

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
              src="/deepseek_chat/"
              title="AI Chat"
              className="chat-widget-iframe"
              loading="lazy"
            />
          )}
        </div>
      )}
      <button className="chat-widget-toggle" onClick={toggle} aria-label="Toggle Assistant">
        {open ? 'x' : 'AI助理'}
      </button>
    </>
  );
}
