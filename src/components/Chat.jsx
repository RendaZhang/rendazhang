import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { sendMessageToAI, resetChat } from '../services/chatService';

const STORAGE_KEY = 'deepseek_chat_history';
const MAX_TOKENS = 15000;
const AVG_WORD_LENGTH = 4;
const AVG_TOKENS_PER_WORD = 1.5;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false); // New: for progress indicator
  const [enhancementFailed, setEnhancementFailed] = useState(false); // New: for failure state
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingIndicatorRef = useRef(null);
  const enhancementProgressRef = useRef(null); // New: ref for progress div

  // Load history from localStorage
  useEffect(() => {
    let conversationHistory = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      conversationHistory = stored ? JSON.parse(stored) : [];
    } catch (e) {
      conversationHistory = [];
    }

    const loadedMessages = conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'ai' : 'user',
      content: msg.content,
      html: msg.role === 'assistant' ? DOMPurify.sanitize(marked.parse(msg.content)) : msg.content
    }));

    setMessages(loadedMessages);
    setIsLoading(false);

    // Load enhancement libraries asynchronously
    loadEnhancementLibraries();

    // Scroll to bottom
    scrollToBottom();
  }, []);

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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const loadEnhancementLibraries = () => {
    // Show progress indicator (as in original)
    setIsEnhancing(true);

    Promise.all([
      loadScript('/js/highlight.min.js', 30000),
      loadScript('/js/mermaid.min.js', 60000)
    ])
      .then(() => {
        if (window.mermaid) {
          window.mermaid.initialize({ startOnLoad: false });
        }
        setLibrariesLoaded(true);
        // Apply enhancements to existing AI messages
        applyEnhancementsToAll();
        // Hide progress with fade out
        enhancementProgressRef.current.style.opacity = '0';
        setTimeout(() => setIsEnhancing(false), 300); // Match original fade out
      })
      .catch((error) => {
        console.error('Enhancement libraries loading failed:', error);
        // Show failure message (as in original)
        enhancementProgressRef.current.innerHTML = '<p>优化功能加载失败，基础功能不受影响</p>';
        document.body.classList.add('basic-mode'); // Add basic-mode class
        // Hide after 2000ms
        setTimeout(() => {
          enhancementProgressRef.current.style.opacity = '0';
          setTimeout(() => setIsEnhancing(false), 300);
        }, 2000);
        setEnhancementFailed(true);
      });
  };

  const loadedScripts = new Map();
  const loadScript = (src, timeout = 10000) => {
    if (loadedScripts.has(src)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      const timer = setTimeout(() => {
        reject(new Error(`Resource loading timeout: ${src}`));
        document.head.removeChild(script);
      }, timeout);
      script.onload = () => {
        clearTimeout(timer);
        loadedScripts.set(src, true);
        resolve();
      };
      script.onerror = (error) => {
        clearTimeout(timer);
        reject(error);
      };
      document.head.appendChild(script);
    });
  };

  const applyEnhancementsToAll = () => {
    document.querySelectorAll('.ai-message div').forEach((contentDiv) => {
      applyEnhancements(contentDiv);
    });
  };

  const applyEnhancements = (container) => {
    if (window.hljs && container) {
      container.querySelectorAll('pre code').forEach((block) => {
        window.hljs.highlightElement(block);
      });
    }
    if (window.mermaid && container) {
      window.mermaid.init(undefined, container.querySelectorAll('.language-mermaid'));
    }
  };

  const countTokens = (msg) => {
    return Math.ceil((msg.content.length / AVG_WORD_LENGTH) * AVG_TOKENS_PER_WORD);
  };

  const trimHistory = () => {
    let tokens = messages.reduce((t, m) => t + countTokens(m), 0);
    while (tokens > MAX_TOKENS && messages.length > 0) {
      messages.shift();
      tokens = messages.reduce((t, m) => t + countTokens(m), 0);
    }
    setMessages([...messages]);
  };

  const saveHistory = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          messages.map((m) => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content
          }))
        )
      );
    } catch (e) {}
  };

  const addMessage = (role, content) => {
    const newMessage = {
      role,
      content,
      html: role === 'ai' ? DOMPurify.sanitize(marked.parse(content)) : content
    };
    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
    if (librariesLoaded && role === 'ai') {
      // Apply enhancements immediately if libraries are loaded
      const lastMessageDiv = chatContainerRef.current.querySelector('.ai-message:last-child div');
      if (lastMessageDiv) {
        applyEnhancements(lastMessageDiv);
      }
    }
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    addMessage('user', message);
    setInput('');
    setIsSending(true);
    typingIndicatorRef.current.style.display = 'block';
    scrollToBottom();

    try {
      await sendMessageToAI(message, (chunkHtml) => {
        // Update the last AI message with chunk
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.role === 'ai') {
            // Update existing AI message
            lastMsg.html = chunkHtml;
            return [...prev.slice(0, -1), { ...lastMsg }];
          } else {
            // Add new AI message
            return [...prev, { role: 'ai', content: '', html: chunkHtml }];
          }
        });
        scrollToBottom();
      });

      trimHistory();
      saveHistory();
    } catch (error) {
      addMessage('ai', `Error: ${error.message}`);
    } finally {
      setIsSending(false);
      typingIndicatorRef.current.style.display = 'none';
      scrollToBottom();
    }
  };

  const handleReset = async () => {
    if (window.confirm('确定要重置会话吗？这将清除所有对话历史。')) {
      try {
        await resetChat();
        setMessages([]);
        // Display reset info text (as in original)
        chatContainerRef.current.innerHTML =
          '<div class="info-text">会话已重置，请输入新消息</div>';
        saveHistory();
      } catch (error) {
        alert(`重置会话失败: ${error.message}`);
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
        <button id="back-button" onClick={() => (window.location.href = './index.html')}>
          ← Back
        </button>
        <h1>AI Chat</h1>
      </header>
      <div className="chat-container" id="chat-container" ref={chatContainerRef}>
        {isLoading ? (
          <div id="loading-indicator" className="loading-indicator">
            <div className="spinner"></div>
            <p>正在加载历史对话...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="info-text">会话已就绪，请输入消息开始对话</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}-message markdown-body`}>
              {msg.role === 'ai' && <div dangerouslySetInnerHTML={{ __html: msg.html }}></div>}
              {msg.role === 'user' && msg.content}
              {msg.role === 'ai' && <CopyButton text={msg.content} />}
            </div>
          ))
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
          disabled={isLoading || isSending}
          placeholder={isLoading ? '正在加载历史对话，请稍候...' : '输入消息...'}
          rows="1"
          autoFocus
        ></textarea>
        <div className="btn-container">
          <button id="send-btn" onClick={handleSend} disabled={isLoading || isSending}>
            发送
          </button>
          <button id="reset-btn" onClick={handleReset} disabled={isLoading || isSending}>
            重置会话
          </button>
        </div>
      </div>
    </div>
  );
}

// CopyButton component for AI messages (unchanged)
function CopyButton({ text }) {
  const [isCopied, setIsCopied] = useState(false);
  const buttonRef = useRef(null);

  const handleCopy = (e) => {
    e.stopPropagation();
    showButton(); // 在复制逻辑中调用显示函数，确保点击时显示
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        buttonRef.current.style.display = 'none';
      }, 1000);
    });
  };

  const showButton = () => {
    if (!isCopied) buttonRef.current.style.display = 'inline-block';
  };

  const hideButton = () => {
    if (!isCopied) buttonRef.current.style.display = 'none';
  };

  return (
    <button
      className="copy-btn"
      ref={buttonRef}
      onClick={handleCopy} // 只保留一个 onClick，用于复制
      onMouseEnter={showButton}
      onMouseLeave={hideButton}
      style={{ display: 'none' }}
    >
      {isCopied ? '已复制' : '复制'}
    </button>
  );
}
