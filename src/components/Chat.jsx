import { useState, useEffect, useRef } from 'react';
// Core libraries will be loaded dynamically to allow graceful fallback
// if the resources fail to load.
import { sendMessageToAI, resetChat } from '../services/chatService';
import useMarkdownPipeline, { showHint } from '../hooks/useMarkdownPipeline';
import {
  STORAGE_KEY,
  MAX_TOKENS,
  AVG_WORD_LENGTH,
  AVG_TOKENS_PER_WORD,
  SCRIPT_TIMEOUTS,
  UI_DURATIONS,
  SCRIPT_PATHS,
  CHAT_TEXT,
  ROLES,
  AI_CHAT_TITLE,
  HOME_PAGE_PATH
} from '../config.js';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false); // New: for progress indicator
  const [enhancementFailed, setEnhancementFailed] = useState(false); // New: for failure state
  const [coreLoaded, setCoreLoaded] = useState(false); // core libs ready
  const [coreLoadError, setCoreLoadError] = useState(false); // core libs failed
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingIndicatorRef = useRef(null);
  const enhancementProgressRef = useRef(null); // New: ref for progress div
  const loadedScriptsRef = useRef(new Map());
  const coreLoadAttemptedRef = useRef(false);
  const [embedded, setEmbedded] = useState(false);

  // Load core markdown libraries first (ensure single execution even in React Strict Mode)
  useEffect(() => {
    if (coreLoadAttemptedRef.current) return;
    coreLoadAttemptedRef.current = true;
    loadCoreLibraries();
  }, []);

  useEffect(() => {
    if (window.self !== window.top) {
      setEmbedded(true);
    }
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
      showHint(CHAT_TEXT.ENHANCEMENT_FAILED);
    }
  }, [enhancementFailed]);

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
        enhancementProgressRef.current.style.opacity = '0';
        setTimeout(() => setIsEnhancing(false), UI_DURATIONS.FADE); // Match original fade out
      })
      .catch((error) => {
        console.error('Enhancement libraries loading failed:', error);
        // Show failure message (as in original)
        enhancementProgressRef.current.innerHTML = `<p>${CHAT_TEXT.ENHANCEMENT_FAILED}</p>`;
        document.body.classList.add('basic-mode'); // Add basic-mode class
        // Hide after delay
        setTimeout(() => {
          enhancementProgressRef.current.style.opacity = '0';
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
    if (window.confirm(CHAT_TEXT.RESET_CONFIRM)) {
      try {
        await resetChat();
        setMessages([]);
        saveHistory([]);
      } catch (error) {
        alert(`${CHAT_TEXT.RESET_FAILED_PREFIX}: ${error.message}`);
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
    <div className="container">
      <header>
        {!embedded && (
          <button id="back-button" onClick={() => (window.location.href = HOME_PAGE_PATH)}>
            ← Back
          </button>
        )}
        <h1>{AI_CHAT_TITLE}</h1>
      </header>
      <div className="chat-container" id="chat-container" ref={chatContainerRef}>
        {coreLoadError ? (
          <div id="loading-indicator" className="loading-indicator">
            <p>{CHAT_TEXT.CORE_LOAD_FAILED}</p>
          </div>
        ) : isLoading ? (
          <div id="loading-indicator" className="loading-indicator">
            <div className="spinner"></div>
            <p>{CHAT_TEXT.LOADING}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="info-text">{CHAT_TEXT.CHAT_READY}</div>
        ) : (
          messages.map((msg, idx) => {
            if (msg.role === ROLES.AI) {
              const streaming = isSending && idx === messages.length - 1;
              return (
                <AIMessage key={idx} text={msg.content} enhance={librariesLoaded && !streaming} />
              );
            }
            return (
              <div key={idx} className="message user-message">
                {msg.content}
              </div>
            );
          })
        )}
      </div>
      <div className="typing-indicator" id="typing-indicator" ref={typingIndicatorRef}>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
      {isEnhancing && (
        <div id="enhancement-progress" ref={enhancementProgressRef}>
          <div className="pulse-container">
            <div className="pulse-dot pulse-dot-1"></div>
            <div className="pulse-dot pulse-dot-2"></div>
            <div className="pulse-dot pulse-dot-3"></div>
          </div>
          <p>正在优化阅读体验...</p>
        </div>
      )}
      <div className="input-area">
        <textarea
          id="message-input"
          ref={messageInputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isSending || coreLoadError}
          placeholder={
            isLoading
              ? CHAT_TEXT.INPUT_PLACEHOLDER_LOADING
              : coreLoadError
                ? CHAT_TEXT.INPUT_PLACEHOLDER_ERROR
                : CHAT_TEXT.INPUT_PLACEHOLDER_DEFAULT
          }
          rows="1"
          autoFocus
        ></textarea>
        <div className="btn-container">
          <button
            id="send-btn"
            onClick={handleSend}
            disabled={isLoading || isSending || coreLoadError}
          >
            发送
          </button>
          <button
            id="reset-btn"
            onClick={handleReset}
            disabled={isLoading || isSending || coreLoadError}
          >
            重置会话
          </button>
        </div>
      </div>
    </div>
  );
}

// AI message with copy button
function AIMessage({ text, enhance }) {
  const [showBtn, setShowBtn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useMarkdownPipeline(text, enhance);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        setShowBtn(false);
      }, UI_DURATIONS.COPY_FEEDBACK);
    });
  };

  const handleMouseEnter = () => setShowBtn(true);
  const handleMouseLeave = () => {
    if (!isCopied) setShowBtn(false);
  };
  const handleClick = () => setShowBtn(true);

  return (
    <div
      className="message ai-message markdown-body"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <button
        className="copy-btn"
        onClick={handleCopy}
        style={{ display: showBtn ? 'inline-block' : 'none' }}
      >
        {isCopied ? '已复制' : '复制'}
      </button>
      <div ref={contentRef}></div>
    </div>
  );
}
