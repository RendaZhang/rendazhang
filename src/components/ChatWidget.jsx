import { useState, useEffect } from 'react';
import Chat from './Chat.jsx';

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

  useEffect(() => {
    loadStyle('/css/chat_widget.css');
  }, []);

  useEffect(() => {
    if (open) {
      loadStyle('/css/deepseek_chat.min.css');
      loadStyle('/css/github-markdown-light.min.css');
    }
  }, [open]);

  const toggle = () => setOpen((o) => !o);

  return (
    <>
      {open && (
        <div className="chat-widget-panel">
          <Chat />
        </div>
      )}
      <button className="chat-widget-toggle" onClick={toggle} aria-label="Toggle Chat">
        {open ? '×' : 'Chat'}
      </button>
    </>
  );
}
