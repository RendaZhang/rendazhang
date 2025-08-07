import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { sendMessageToAI, resetChat } from '../../services';
import { useChatHistory } from '../../hooks';
import { ROLES } from '../../constants';
import { useLanguage } from '../providers';
import { DEEPSEEK_CHAT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

interface ChatProps {
  texts?: typeof DEEPSEEK_CHAT_CONTENT;
}

export default function Chat({ texts = DEEPSEEK_CHAT_CONTENT }: ChatProps) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh;
  const textsEn = texts.en;
  const activeTexts = langKey === 'zh' ? textsZh : textsEn;
  const { messages, addMessage, setMessages, clearHistory } = useChatHistory();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const librariesLoaded = true;

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

  // Update placeholder after language changes
  useEffect(() => {
    setPlaceholder(activeTexts.placeholders.default);
  }, [langKey, activeTexts]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    addMessage(ROLES.USER, message);
    setInput('');
    setIsSending(true);
    if (typingIndicatorRef.current) {
      typingIndicatorRef.current.style.display = 'block';
    }

    try {
      const aiText = await sendMessageToAI(message, (partial) => {
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
    if (window.confirm(activeTexts.resetConfirm)) {
      try {
        await resetChat();
        clearHistory();
      } catch (error) {
        const err = error as Error;
        alert(`${activeTexts.resetFailedPrefix}: ${err.message}`);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
        {messages.length === 0 ? (
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
            onRendered={() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              }
            }}
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
        disabled={isSending}
        placeholder={placeholder}
        inputRef={messageInputRef}
        textsZh={textsZh}
        textsEn={textsEn}
      />
    </div>
  );
}
