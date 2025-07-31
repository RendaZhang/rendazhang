import { useState, useEffect, useRef } from 'react';
// Core libraries will be loaded dynamically to allow graceful fallback
// if the resources fail to load.
import { sendMessageToAI, resetChat } from '../../services';
import { showHint } from '../../hooks';
import {
  STORAGE_KEY,
  MAX_TOKENS,
  AVG_WORD_LENGTH,
  AVG_TOKENS_PER_WORD,
  SCRIPT_TIMEOUTS,
  UI_DURATIONS,
  SCRIPT_PATHS,
  ROLES
} from '../../config.js';
import { useLanguage } from '../providers';
import { DEEPSEEK_CHAT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import ChatMessageList from './ChatMessageList.jsx';
import ChatInput from './ChatInput.jsx';
import LoadingIndicator from './LoadingIndicator.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import EnhancementProgress from './EnhancementProgress.jsx';

export default function Chat({ texts = DEEPSEEK_CHAT_CONTENT }) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh;
  const textsEn = texts.en;
  const activeTexts = langKey === 'zh' ? textsZh : textsEn;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false); // New: for progress indicator
  const [enhancementFailed, setEnhancementFailed] = useState(false); // New: for failure state
  const [coreLoaded, setCoreLoaded] = useState(false); // core libs ready
  const [coreLoadError, setCoreLoadError] = useState(false); // core libs failed
  const [placeholder, setPlaceholder] = useState('');
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingIndicatorRef = useRef(null);
  const enhancementProgressRef = useRef(null); // New: ref for progress div
  const loadedScriptsRef = useRef(new Map());
  const coreLoadAttemptedRef = useRef(false);

  // Load core markdown libraries first (ensure single execution even in React Strict Mode)
  useEffect(() => {
    if (coreLoadAttemptedRef.current) return;
    coreLoadAttemptedRef.current = true;
    loadCoreLibraries();
  }, []);

  // Load history from localStorage after core libs are ready
  useEffect(() => {
    if (!coreLoaded) return;
    let conversationHistory = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      conversationHistory = stored ? JSON.parse(stored) : [];
    } catch (e) {
      conversationHistory = [];
    }

    const loadedMessages = conversationHistory.map((msg) => ({
      role: msg.role === ROLES.ASSISTANT ? ROLES.AI : ROLES.USER,
      content: msg.content
    }));

    setMessages(loadedMessages);

    // Load enhancement libraries asynchronously while history renders
    loadEnhancementLibraries();

    // History rendered - allow user interaction
    setIsLoading(false);

    // Scroll to bottom
    scrollToBottom();
  }, [coreLoaded]);

  // Auto-adjust textarea height
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (enhancementFailed) {
      showHint(activeTexts.enhancementFailed);
    }
  }, [enhancementFailed, activeTexts]);

  // Update placeholder after language or loading state changes
  useEffect(() => {
    const ph = isLoading
      ? activeTexts.placeholders.loading
      : coreLoadError
        ? activeTexts.placeholders.error
        : activeTexts.placeholders.default;
    setPlaceholder(ph);
  }, [langKey, isLoading, coreLoadError, activeTexts]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const loadCoreLibraries = () => {
    Promise.all([
      loadScript(SCRIPT_PATHS.MARKED, SCRIPT_TIMEOUTS.DEFAULT),
      loadScript(SCRIPT_PATHS.PURIFY, SCRIPT_TIMEOUTS.DEFAULT)
    ])
      .then(() => {
        if (window.marked && window.DOMPurify) {
          setCoreLoaded(true);
        } else {
          throw new Error('Core libraries missing');
        }
      })
      .catch((error) => {
        console.error('Core libraries loading failed:', error);
        setCoreLoadError(true);
        setIsLoading(false);
      });
  };

  const loadEnhancementLibraries = () => {
    // Show progress indicator (as in original)
    setIsEnhancing(true);

    Promise.all([
      loadScript(SCRIPT_PATHS.HIGHLIGHT, SCRIPT_TIMEOUTS.HIGHLIGHT),
      loadScript(SCRIPT_PATHS.MERMAID, SCRIPT_TIMEOUTS.MERMAID)
    ])
      .then(() => {
        if (window.mermaid) {
          window.mermaid.initialize({ startOnLoad: false });
        }
        setLibrariesLoaded(true);
        // Hide progress with fade out
        if (enhancementProgressRef.current) {
          enhancementProgressRef.current.style.opacity = '0';
        }
        setTimeout(() => setIsEnhancing(false), UI_DURATIONS.FADE); // Match original fade out
      })
      .catch((error) => {
        console.error('Enhancement libraries loading failed:', error);
        // Show failure message (as in original)
        if (enhancementProgressRef.current) {
          enhancementProgressRef.current.innerHTML = `<p><span class="lang-zh">${textsZh.enhancementFailed}</span><span class="lang-en">${textsEn.enhancementFailed}</span></p>`;
        }
        document.body.classList.add('basic-mode'); // Add basic-mode class
        // Hide after delay
        setTimeout(() => {
          if (enhancementProgressRef.current) {
            enhancementProgressRef.current.style.opacity = '0';
          }
          setTimeout(() => setIsEnhancing(false), UI_DURATIONS.FADE);
        }, UI_DURATIONS.ERROR_HIDE_DELAY);
        setEnhancementFailed(true);
      });
  };

  const loadScript = (src, timeout = SCRIPT_TIMEOUTS.DEFAULT) => {
    if (loadedScriptsRef.current.has(src)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      const timer = setTimeout(() => {
        reject(new Error(`Resource loading timeout: ${src}`));
        document.head.removeChild(script);
      }, timeout);
      script.onload = () => {
        clearTimeout(timer);
        loadedScriptsRef.current.set(src, true);
        resolve();
      };
      script.onerror = (error) => {
        clearTimeout(timer);
        reject(error);
      };
      document.head.appendChild(script);
    });
  };

  const countTokens = (msg) => {
    return Math.ceil((msg.content.length / AVG_WORD_LENGTH) * AVG_TOKENS_PER_WORD);
  };

  const trimHistory = (msgList) => {
    let tokens = msgList.reduce((t, m) => t + countTokens(m), 0);
    while (tokens > MAX_TOKENS && msgList.length > 0) {
      msgList.shift();
      tokens = msgList.reduce((t, m) => t + countTokens(m), 0);
    }
    return msgList;
  };

  const saveHistory = (msgList) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          msgList.map((m) => ({
            role: m.role === ROLES.AI ? ROLES.ASSISTANT : ROLES.USER,
            content: m.content
          }))
        )
      );
    } catch (e) {}
  };

  const addMessage = (role, content) => {
    const newMessage = { role, content };
    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message || coreLoadError || !coreLoaded) return;

    addMessage(ROLES.USER, message);
    setInput('');
    setIsSending(true);
    typingIndicatorRef.current.style.display = 'block';
    scrollToBottom();

    try {
      const aiText = await sendMessageToAI(message, (partial) => {
        // Update the last AI message with streamed Markdown
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === ROLES.AI) {
            lastMsg.content = partial;
            return [...prev.slice(0, -1), { ...lastMsg }];
          }
          return [...prev, { role: ROLES.AI, content: partial }];
        });
        scrollToBottom();
      });
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === ROLES.AI) {
          lastMsg.content = aiText;
        }
        const trimmed = trimHistory(updated);
        saveHistory(trimmed);
        return trimmed;
      });
    } catch (error) {
      addMessage(ROLES.AI, `Error: ${error.message}`);
    } finally {
      setIsSending(false);
      typingIndicatorRef.current.style.display = 'none';
      scrollToBottom();
    }
  };

  const handleReset = async () => {
    if (window.confirm(activeTexts.resetConfirm)) {
      try {
        await resetChat();
        setMessages([]);
        saveHistory([]);
      } catch (error) {
        alert(`${activeTexts.resetFailedPrefix}: ${error.message}`);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-wrapper">
      <header className="app-header">
        <h1>
          <LocalizedSection zhContent={textsZh.title} enContent={textsEn.title} />
        </h1>
      </header>
      <div className="chat-container" id="chat-container" ref={chatContainerRef}>
        {coreLoadError || isLoading ? (
          <LoadingIndicator isError={coreLoadError} textsZh={textsZh} textsEn={textsEn} />
        ) : messages.length === 0 ? (
          <div className="info-text">
            <LocalizedSection zhContent={textsZh.chatReady} enContent={textsEn.chatReady} />
          </div>
        ) : (
          <ChatMessageList
            messages={messages}
            isSending={isSending}
            librariesLoaded={librariesLoaded}
            textsZh={textsZh}
            textsEn={textsEn}
            onRendered={scrollToBottom}
          />
        )}
      </div>
      <TypingIndicator innerRef={typingIndicatorRef} />
      <EnhancementProgress
        show={isEnhancing}
        innerRef={enhancementProgressRef}
        textsZh={textsZh}
        textsEn={textsEn}
      />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onReset={handleReset}
        onKeyDown={handleKeyDown}
        disabled={isLoading || isSending || coreLoadError}
        placeholder={placeholder}
        inputRef={messageInputRef}
        textsZh={textsZh}
        textsEn={textsEn}
      />
    </div>
  );
}
