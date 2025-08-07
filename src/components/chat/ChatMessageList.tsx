import AIMessage from './AIMessage';
import { ROLES } from '../../constants';
import type { ChatMessage, ChatCallback, CopyTexts } from '../../types/chat';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
  librariesLoaded: boolean;
  textsZh: CopyTexts;
  textsEn: CopyTexts;
  onRendered?: ChatCallback;
}

export default function ChatMessageList({
  messages,
  isSending,
  librariesLoaded,
  textsZh,
  textsEn,
  onRendered
}: ChatMessageListProps) {
  return messages.map((msg, idx) => {
    if (msg.role === ROLES.AI) {
      const streaming = isSending && idx === messages.length - 1;
      return (
        <AIMessage
          key={idx}
          text={msg.content}
          enhance={librariesLoaded && !streaming}
          onRendered={onRendered}
          textsZh={textsZh}
          textsEn={textsEn}
        />
      );
    }
    return (
      <div key={idx} className="message user-message">
        {msg.content}
      </div>
    );
  });
}
