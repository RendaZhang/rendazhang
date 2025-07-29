import React from 'react';
import Chat from '../Chat.jsx';
import { DEEPSEEK_CHAT_CONTENT } from '../../../content/deepseekChatContent.js';

export default function DeepseekChatContent() {
  return <Chat texts={DEEPSEEK_CHAT_CONTENT} />;
}
