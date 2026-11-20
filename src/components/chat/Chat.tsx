import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import type { KeyboardEvent } from 'react';
import {
  createChatController,
  type AddChatMessage,
  type ChatController
} from '../../controllers/chatController';
import { useChatHistory } from '../../hooks';
import { DEEPSEEK_CHAT_CONTENT } from '../../content/deepseekChatContent';
import {
  getChatGuideSourceHints,
  type ChatGuideSourceHintGroup
} from '../../content/chatGuideKnowledge';
import { LocalizedSection, Modal } from '../ui';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import LoadingIndicator from './LoadingIndicator';
import ChatPresetQuestions from './ChatPresetQuestions';
import { ROLES } from '../../constants';
import { isChatPresetQuestionId, type ChatPresetQuestionId } from '../../services/visitorEvents';
import { CHAT_GUIDE_MODE_PUBLIC_SITE } from '../../services/chatService';

interface ChatProps {
  texts?: typeof DEEPSEEK_CHAT_CONTENT;
}

type ChatDraft = { text: string } | { presetId: ChatPresetQuestionId };
const EMPTY_DRAFT: ChatDraft = { text: '' };

function subscribeToChatLanguage(onChange: () => void) {
  window.addEventListener('langChanged', onChange);
  return () => window.removeEventListener('langChanged', onChange);
}

function readChatLanguage(): 'zh' | 'en' {
  return document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
}

function previewFromUrl(): ChatDraft {
  const presets = new URLSearchParams(window.location.search).getAll('preset');
  return presets.length === 1 && isChatPresetQuestionId(presets[0])
    ? { presetId: presets[0] }
    : EMPTY_DRAFT;
}

function updatePresetUrl(presetId: ChatPresetQuestionId | null) {
  const url = new URL(window.location.href);
  if (presetId) {
    url.searchParams.set('preset', presetId);
    if (url.href !== window.location.href) window.history.pushState(window.history.state, '', url);
  } else if (url.searchParams.has('preset')) {
    url.searchParams.delete('preset');
    window.history.replaceState(window.history.state, '', url);
  }
}

export default function Chat({ texts = DEEPSEEK_CHAT_CONTENT }: ChatProps) {
  const langKey = useSyncExternalStore<'zh' | 'en'>(
    subscribeToChatLanguage,
    readChatLanguage,
    () => 'zh'
  );
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
  const [draft, setDraft] = useState<ChatDraft>(EMPTY_DRAFT);
  const selectedPresetId = 'presetId' in draft ? draft.presetId : null;
  const input = 'presetId' in draft ? activeTexts.presets.questions[draft.presetId] : draft.text;
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [sourceHintsByMessageIndex, setSourceHintsByMessageIndex] = useState<
    Readonly<Record<number, ChatGuideSourceHintGroup>>
  >({});
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const chatControllerRef = useRef<ChatController | null>(null);
  const pendingGuideSourceHintsRef = useRef<ChatGuideSourceHintGroup | null>(null);
  const pendingGuideAssistantIndexRef = useRef<number | null>(null);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const pageReadyRef = useRef(false);
  const enhancementReadyRef = useRef(false);
  const isReady = historyLoaded;
  const controlsDisabled = !isReady || isSending || isResetting;
  const placeholder = isReady
    ? activeTexts.placeholders.default
    : loadError
      ? activeTexts.placeholders.error
      : activeTexts.placeholders.loading;
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
    const syncPreview = () => setDraft(previewFromUrl());
    const restorePreview = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      const restoredDraft = previewFromUrl();
      if ('presetId' in restoredDraft) setDraft(restoredDraft);
    };
    syncPreview();
    window.addEventListener('popstate', syncPreview);
    window.addEventListener('pageshow', restorePreview);
    return () => {
      window.removeEventListener('popstate', syncPreview);
      window.removeEventListener('pageshow', restorePreview);
    };
  }, []);

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
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Return focus to the composer when the embedded window finishes loading.
  useEffect(() => {
    if (isReady && window.parent !== window) {
      messageInputRef.current?.focus({ preventScroll: true });
    }
  }, [isReady]);

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

  const sendChatMessage = async (message: string, presetId: ChatPresetQuestionId | null = null) => {
    const shouldSendGroundedPreset = Boolean(presetId);
    const sourceHints =
      shouldSendGroundedPreset && presetId ? getChatGuideSourceHints(presetId, langKey) : null;
    const addTrackedMessage: AddChatMessage = (role, content) => {
      const nextMessages = addMessage(role, content);
      if (sourceHints && role === ROLES.USER) {
        pendingGuideSourceHintsRef.current = sourceHints;
        pendingGuideAssistantIndexRef.current = Array.isArray(nextMessages)
          ? nextMessages.length
          : messages.length + 1;
      }
      return nextMessages;
    };

    await chatController.sendMessage({
      input: message,
      displayInput: shouldSendGroundedPreset ? message : undefined,
      guideMode: shouldSendGroundedPreset ? CHAT_GUIDE_MODE_PUBLIC_SITE : undefined,
      presetId: shouldSendGroundedPreset && presetId ? presetId : undefined,
      locale: shouldSendGroundedPreset ? langKey : undefined,
      addMessage: addTrackedMessage,
      setMessages,
      onAccepted: () => {
        setDraft(EMPTY_DRAFT);
        setIsSending(true);
        if (typingIndicatorRef.current) {
          typingIndicatorRef.current.style.display = 'block';
        }
      },
      onFirstChunk: () => {
        const pendingSourceHints = pendingGuideSourceHintsRef.current;
        const pendingAssistantIndex = pendingGuideAssistantIndexRef.current;
        if (pendingSourceHints && pendingAssistantIndex !== null) {
          setSourceHintsByMessageIndex((currentSourceHints) => ({
            ...currentSourceHints,
            [pendingAssistantIndex]: pendingSourceHints
          }));
        }
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
        pendingGuideSourceHintsRef.current = null;
        pendingGuideAssistantIndexRef.current = null;
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

  const handleSend = async () => {
    if (controlsDisabled || showResetModal || chatController.hasActiveRequest()) return;
    await sendChatMessage(input, selectedPresetId);
  };

  const handlePresetSelect = (presetId: ChatPresetQuestionId) => {
    updatePresetUrl(presetId);
    setDraft({ presetId });
  };

  const handleInputChange = (nextInput: string) => {
    setDraft({ text: nextInput });
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
      onSuccess: () => {
        updatePresetUrl(null);
        setDraft(EMPTY_DRAFT);
        setSourceHintsByMessageIndex({});
        setShowResetModal(false);
      },
      onError: (message) => setResetError(message),
      onFinally: () => setIsResetting(false)
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Safari can finish composition before dispatching the Enter that confirmed the candidate.
      if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="c-chat-tool">
      <ChatPresetQuestions
        heading={activeTexts.presets.heading}
        description={activeTexts.presets.description}
        topics={activeTexts.presets.topics}
        selectedPresetId={selectedPresetId}
        disabled={controlsDisabled}
        onSelect={handlePresetSelect}
      />
      <div className={`c-chat-desk${isReady && messages.length === 0 ? ' is-empty' : ''}`}>
        <div className="c-chat-container" id="chat-container" ref={chatContainerRef}>
          {!isReady && <LoadingIndicator isError={loadError} textsZh={textsZh} textsEn={textsEn} />}
          {isReady && messages.length > 0 && (
            <ChatMessageList
              messages={messages}
              isSending={isSending}
              librariesLoaded={librariesLoaded}
              copyTexts={activeTexts}
              sourceHintsByMessageIndex={sourceHintsByMessageIndex}
              sourceHintsHeading={activeTexts.sourceHints.heading}
              sourceHintsAriaLabel={activeTexts.sourceHints.ariaLabel}
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
          disabled={controlsDisabled}
          placeholder={placeholder}
          inputRef={messageInputRef}
          previewStatus={selectedPresetId ? activeTexts.presets.previewStatus : ''}
          texts={activeTexts}
        />
      </div>
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
