import { useCallback, useEffect, useRef, useState } from 'react';
import useUiPreferences from '../../hooks/useUiPreferences';
import LocalizedSection from '../ui/data-display/LocalizedSection';
import ThemeToggle from '../ui/inputs/ThemeToggle';

const paletteSource =
  'https://github.com/RendaZhang/rendazhang/blob/926afd23c8d7e50dcbb9ff780882eb26bd7e848d/src/styles/core/theme-tokens.css#L390-L469';

const chatStatusText = {
  closed: { zh: '已关闭', en: 'Closed' },
  loading: { zh: '加载中…', en: 'Loading…' },
  ready: { zh: '已就绪', en: 'Ready' }
};

export default function SitePerspective({ language }: { language: string }) {
  const [open, setOpen] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const { chatWidgetStatus } = useUiPreferences();
  const status = chatStatusText[chatWidgetStatus];

  const close = useCallback(() => {
    setOpen(false);
    setShowBrand(false);
    setShowChat(false);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !event.defaultPrevented && !event.isComposing) {
        event.preventDefault();
        close();
      }
    }
    // The same-origin chat can move focus into its iframe when it becomes ready.
    const chatDocument =
      chatWidgetStatus === 'ready'
        ? document.querySelector<HTMLIFrameElement>('#chat-widget-panel iframe')?.contentDocument
        : null;
    document.addEventListener('keydown', handleEscape);
    chatDocument?.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      chatDocument?.removeEventListener('keydown', handleEscape);
    };
  }, [open, close, chatWidgetStatus]);

  return (
    <section
      className="c-site-perspective"
      aria-labelledby="site-perspective-title"
      data-site-perspective=""
      data-show-brand={showBrand ? '' : undefined}
    >
      <h2 id="site-perspective-title">
        <button
          ref={opener}
          className="c-site-perspective-trigger"
          type="button"
          aria-expanded={open}
          aria-controls="site-perspective-notes"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <LocalizedSection zhContent="拆开这一页" enContent="Look inside this page" />
          <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
      </h2>
      <div id="site-perspective-notes" className="c-site-perspective-notes" hidden={!open}>
        <div className="c-site-perspective-note">
          <h3>
            <button
              className="c-site-perspective-trigger"
              type="button"
              aria-expanded={showBrand}
              aria-controls="site-perspective-brand"
              onClick={() => setShowBrand((current) => !current)}
            >
              <LocalizedSection zhContent="墨与朱" enContent="Ink and vermilion" />
              <span aria-hidden="true">{showBrand ? '−' : '+'}</span>
            </button>
          </h3>
          <div
            id="site-perspective-brand"
            className="c-site-perspective-detail"
            hidden={!showBrand}
          >
            <p>
              <LocalizedSection
                zhContent="换个色板，看看描边标出的首页入口、演示按钮和聊天气泡怎样一起换色。"
                enContent="Switch palettes to see the outlined homepage links, demo buttons, and chat launcher change color together."
              />
            </p>
            {showBrand && <ThemeToggle language={language} />}
            <a href={paletteSource}>
              <LocalizedSection zhContent="查看配色源码" enContent="View palette source" />
            </a>
          </div>
        </div>
        <div className="c-site-perspective-note">
          <h3>
            <button
              className="c-site-perspective-trigger"
              type="button"
              aria-expanded={showChat}
              aria-controls="site-perspective-chat"
              onClick={() => setShowChat((current) => !current)}
            >
              <LocalizedSection zhContent="聊天气泡" enContent="Chat bubble" />
              <span aria-hidden="true">{showChat ? '−' : '+'}</span>
            </button>
          </h3>
          <div id="site-perspective-chat" className="c-site-perspective-detail" hidden={!showChat}>
            <p>
              <LocalizedSection
                zhContent="打开右下角的气泡，就能看到聊天窗口从加载中变为就绪。"
                enContent="Open the bubble in the lower right to watch the chat window load and become ready."
              />
            </p>
            <button
              className="c-site-perspective-jump"
              type="button"
              onClick={() => document.getElementById('chat-widget-toggle')?.focus()}
            >
              <LocalizedSection zhContent="定位聊天气泡" enContent="Focus the chat bubble" />
            </button>
            <div
              className="c-site-perspective-chat-status"
              data-floating={chatWidgetStatus !== 'closed' ? '' : undefined}
            >
              <p role="status">
                <LocalizedSection
                  zhContent={`聊天气泡 · ${status.zh}`}
                  enContent={`Chat bubble · ${status.en}`}
                />
              </p>
              {chatWidgetStatus !== 'closed' && (
                <button type="button" onClick={close}>
                  <LocalizedSection zhContent="退出透视" enContent="Exit view" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
