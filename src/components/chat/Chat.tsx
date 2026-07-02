import { useState, useEffect, useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { createChatController, type ChatController } from '../../controllers/chatController';
import { useChatHistory } from '../../hooks';
import { useLanguage } from '../providers';
import { DEEPSEEK_CHAT_CONTENT } from '../../content';
import { buildChatGuidePresetPrompt } from '../../content/chatGuideKnowledge';
import { LocalizedSection, Modal } from '../ui';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import LoadingIndicator from './LoadingIndicator';
import ChatPresetQuestions from './ChatPresetQuestions';
import type { ChatPresetQuestionId } from '../../services/visitorEvents';

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
  const [selectedPresetId, setSelectedPresetId] = useState<ChatPresetQuestionId | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const chatControllerRef = useRef<ChatController | null>(null);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const pageReadyRef = useRef(false);
  const enhancementReadyRef = useRef(false);
  const isReady = historyLoaded;
  if (!chatControllerRef.current) {
    chatControllerRef.current = createChatController();
  }
  const chatController = chatControllerRef.current;

  const notifyParent = useCallback((type: 'chat-page-ready' | 'chat-enhancement-ready') => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type }, window.location.origin);
    }
  }, []);

  const handleRendered = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (!pageReadyRef.current) {
      notifyParent('chat-page-ready');
      pageReadyRef.current = true;
    }
    if (librariesLoaded && !enhancementReadyRef.current) {
      notifyParent('chat-enhancement-ready');
      enhancementReadyRef.current = true;
    }
  }, [librariesLoaded, notifyParent]);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        const [{ default: getProjectHighlighter }] = await Promise.all([
          import('../../utils/highlight'),
          import('mermaid')
        ]);
        getProjectHighlighter();
        setLibrariesLoaded(true);
      } catch (err) {
        console.error('Failed to load enhancement libraries', err);
        setLoadError(true);
      }
    };
    void loadLibraries();
  }, []);

  useEffect(() => {
    if (isReady && messages.length === 0 && !pageReadyRef.current) {
      notifyParent('chat-page-ready');
      pageReadyRef.current = true;
    }
  }, [isReady, messages.length, notifyParent]);

  useEffect(() => {
    if (isReady && librariesLoaded && messages.length === 0 && !enhancementReadyRef.current) {
      notifyParent('chat-enhancement-ready');
      enhancementReadyRef.current = true;
    }
  }, [isReady, librariesLoaded, messages.length, notifyParent]);

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

  useEffect(() => {
    setSelectedPresetId(null);
  }, [langKey]);

  useEffect(() => {
    const inputEl = messageInputRef.current;
    if (!inputEl) return;

    const handleFocus = () => {
      if (typeof inputEl.scrollIntoView === 'function') {
        inputEl.scrollIntoView({ block: 'nearest' });
      } else {
        window.scrollTo({ top: inputEl.offsetTop });
      }
    };

    inputEl.addEventListener('focus', handleFocus);
    return () => {
      inputEl.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleSend = async () => {
    const presetQuestion = selectedPresetId
      ? activeTexts.presets.questions[selectedPresetId]
      : null;
    const shouldSendGroundedPreset =
      Boolean(selectedPresetId && presetQuestion) && input === presetQuestion;
    const messageInput =
      shouldSendGroundedPreset && selectedPresetId
        ? buildChatGuidePresetPrompt(selectedPresetId, input, langKey)
        : input;

    await chatController.sendMessage({
      input: messageInput,
      displayInput: shouldSendGroundedPreset ? input : undefined,
      addMessage,
      setMessages,
      onAccepted: () => {
        setInput('');
        setSelectedPresetId(null);
        setIsSending(true);
        if (typingIndicatorRef.current) {
          typingIndicatorRef.current.style.display = 'block';
        }
      },
      onFirstChunk: () => {
        if (typingIndicatorRef.current) {
          typingIndicatorRef.current.style.display = 'none';
        }
      },
      onChunk: () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      },
      onFinally: () => {
        setIsSending(false);
        if (typingIndicatorRef.current) {
          typingIndicatorRef.current.style.display = 'none';
        }
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    });
  };

  const handlePresetSelect = (presetId: ChatPresetQuestionId, question: string) => {
    setSelectedPresetId(presetId);
    setInput(question);
    messageInputRef.current?.focus();
  };

  const handleInputChange = (nextInput: string) => {
    setInput(nextInput);
    if (!selectedPresetId) {
      return;
    }

    const presetQuestion = activeTexts.presets.questions[selectedPresetId];
    if (nextInput !== presetQuestion) {
      setSelectedPresetId(null);
    }
  };

  const handleReset = () => {
    setShowResetModal(true);
    setResetError(null);
  };

  const confirmReset = async () => {
    setIsResetting(true);
    await chatController.resetHistory({
      clearHistory,
      errorPrefix: activeTexts.resetFailedPrefix,
      onSuccess: () => setShowResetModal(false),
      onError: (message) => setResetError(message),
      onFinally: () => setIsResetting(false)
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
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
          <div className="c-chat-empty-state">
            <div className="c-info-text">
              <LocalizedSection zhContent={textsZh.chatReady} enContent={textsEn.chatReady} />
            </div>
            <ChatPresetQuestions
              heading={activeTexts.presets.heading}
              description={activeTexts.presets.description}
              questions={activeTexts.presets.questions}
              disabled={isSending || isResetting}
              onSelect={handlePresetSelect}
            />
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
        onChange={handleInputChange}
        onSend={handleSend}
        onReset={handleReset}
        onKeyDown={handleKeyDown}
        disabled={!isReady || isSending || isResetting}
        placeholder={placeholder}
        inputRef={messageInputRef}
        textsEn={textsEn}
      />
      <Modal isOpen={showResetModal} onClose={() => !isResetting && setShowResetModal(false)}>
        {resetError ? (
          <>
            <p>{resetError}</p>
            <button className="c-btn-primary c-btn-chat" onClick={() => setShowResetModal(false)}>
              <LocalizedSection
                zhContent={textsZh.confirmButton}
                enContent={textsEn.confirmButton}
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
                <button
                  className="c-btn-primary c-btn-chat"
                  onClick={() => {
                    void confirmReset();
                  }}
                >
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
