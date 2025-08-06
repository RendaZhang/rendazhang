import AIMessage from './AIMessage.jsx';
import { ROLES } from '../../constants/index.ts';

export default function ChatMessageList({
  messages,
  isSending,
  librariesLoaded,
  textsZh,
  textsEn,
  onRendered
}) {
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
