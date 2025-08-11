import { useState, useEffect, useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { sendMessageToAI, resetChat } from '../../services';
import { useChatHistory } from '../../hooks';
import { ROLES } from '../../constants';
import { useLanguage } from '../providers';
import { DEEPSEEK_CHAT_CONTENT } from '../../content';
import { LocalizedSection, Modal } from '../ui';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import LoadingIndicator from './LoadingIndicator';

interface ChatProps {
  texts?: typeof DEEPSEEK_CHAT_CONTENT;
}

export default function Chat({ texts = DEEPSEEK_CHAT_CONTENT }: ChatProps) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh;
  const textsEn = texts.en;
  const activeTexts = langKey === 'zh' ? textsZh : textsEn;
  const {
    messages,
    addMessage,
    setMessages,
    clearHistory,
    isLoaded: historyLoaded
  } = useChatHistory();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState('');
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const pageReadyRef = useRef(false);
  const enhancementReadyRef = useRef(false);
  const isReady = historyLoaded;

  const handleRendered = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (!pageReadyRef.current) {
      window.parent?.postMessage({ type: 'chat-page-ready' }, '*');
      pageReadyRef.current = true;
    }
    if (librariesLoaded && !enhancementReadyRef.current) {
      window.parent?.postMessage({ type: 'chat-enhancement-ready' }, '*');
      enhancementReadyRef.current = true;
    }
  }, [librariesLoaded]);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        await Promise.all([import('highlight.js'), import('mermaid')]);
        setLibrariesLoaded(true);
      } catch (err) {
        console.error('Failed to load enhancement libraries', err);
        setLoadError(true);
      }
    };
    loadLibraries();
  }, []);

  useEffect(() => {
    if (isReady && messages.length === 0 && !pageReadyRef.current) {
      window.parent?.postMessage({ type: 'chat-page-ready' }, '*');
      pageReadyRef.current = true;
    }
  }, [isReady, messages.length]);

  useEffect(() => {
    if (isReady && librariesLoaded && messages.length === 0 && !enhancementReadyRef.current) {
      window.parent?.postMessage({ type: 'chat-enhancement-ready' }, '*');
      enhancementReadyRef.current = true;
    }
  }, [isReady, librariesLoaded, messages.length]);

  // Auto-adjust textarea height
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Update placeholder after language or readiness changes
  useEffect(() => {
    if (!isReady) {
      setPlaceholder(loadError ? activeTexts.placeholders.error : activeTexts.placeholders.loading);
    } else {
      setPlaceholder(activeTexts.placeholders.default);
    }
  }, [langKey, activeTexts, isReady, loadError]);

  // Focus textarea when ready
  useEffect(() => {
    if (isReady && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isReady]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    addMessage(ROLES.USER, message);
    setInput('');
    setIsSending(true);
    if (typingIndicatorRef.current) {
      typingIndicatorRef.current.style.display = 'block';
    }
    let hasReceivedChunk = false;

    try {
      const aiText = await sendMessageToAI(message, (partial) => {
        if (!hasReceivedChunk) {
          hasReceivedChunk = true;
          if (typingIndicatorRef.current) {
            typingIndicatorRef.current.style.display = 'none';
          }
        }
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === ROLES.AI) {
            lastMsg.content = partial;
            return [...prev.slice(0, -1), { ...lastMsg }];
          }
          return [...prev, { role: ROLES.AI, content: partial }];
        });
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === ROLES.AI) {
          lastMsg.content = aiText;
        }
        return updated;
      });
    } catch (error) {
      const err = error as Error;
      addMessage(ROLES.AI, `Error: ${err.message}`);
    } finally {
      setIsSending(false);
      if (typingIndicatorRef.current) {
        typingIndicatorRef.current.style.display = 'none';
      }
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  };

  const handleReset = async () => {
    setShowResetModal(true);
    setResetError(null);
  };

  const confirmReset = async () => {
    setIsResetting(true);
    try {
      await resetChat();
      clearHistory();
      setShowResetModal(false);
    } catch (error) {
      const err = error as Error;
      setResetError(`${activeTexts.resetFailedPrefix}: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="c-chat-wrapper">
      <header className="c-app-header">
        <h1>
          <LocalizedSection zhContent={textsZh.title} enContent={textsEn.title} />
        </h1>
      </header>
      <div className="c-chat-container" id="chat-container" ref={chatContainerRef}>
        {!isReady ? (
          <LoadingIndicator isError={loadError} textsZh={textsZh} textsEn={textsEn} />
        ) : messages.length === 0 ? (
          <div className="c-info-text">
            <LocalizedSection zhContent={textsZh.chatReady} enContent={textsEn.chatReady} />
          </div>
        ) : (
          <ChatMessageList
            messages={messages}
            isSending={isSending}
            librariesLoaded={librariesLoaded}
            textsZh={textsZh}
            textsEn={textsEn}
            onRendered={handleRendered}
          />
        )}
      </div>
      <TypingIndicator innerRef={typingIndicatorRef} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onReset={handleReset}
        onKeyDown={handleKeyDown}
        disabled={!isReady || isSending || isResetting}
        placeholder={placeholder}
        inputRef={messageInputRef}
        textsZh={textsZh}
        textsEn={textsEn}
      />
      <Modal isOpen={showResetModal} onClose={() => !isResetting && setShowResetModal(false)}>
        {resetError ? (
          <>
            <p>{resetError}</p>
            <button className="c-btn-primary c-btn-chat" onClick={() => setShowResetModal(false)}>
              <LocalizedSection
                zhContent={textsZh.confirmButton}
                enContent={textsEn.confirmButtom}
              />
            </button>
          </>
        ) : (
          <>
            <p>
              <LocalizedSection zhContent={textsZh.resetConfirm} enContent={textsEn.resetConfirm} />
            </p>
            {isResetting ? (
              <div className="c-loader" />
            ) : (
              <div className="c-btn-container" style={{ justifyContent: 'center' }}>
                <button
                  className="c-btn-secondary c-btn-chat"
                  onClick={() => setShowResetModal(false)}
                >
                  <LocalizedSection
                    zhContent={textsZh.cancelButton}
                    enContent={textsEn.cancelButton}
                  />
                </button>
                <button className="c-btn-primary c-btn-chat" onClick={confirmReset}>
                  <LocalizedSection
                    zhContent={textsZh.resetButton}
                    enContent={textsEn.resetButton}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
