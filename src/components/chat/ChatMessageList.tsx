import AIMessage from './AIMessage';
import { ROLES } from '../../constants';
import type { ChatMessage, ChatCallback, CopyTexts } from '../../types/chat';
import type { ChatGuideSourceHintGroup } from '../../content/chatGuideKnowledge';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
  librariesLoaded: boolean;
  textsZh: CopyTexts;
  textsEn: CopyTexts;
  sourceHintsByMessageIndex?: Readonly<Record<number, ChatGuideSourceHintGroup>>;
  sourceHintsHeading: string;
  sourceHintsAriaLabel: string;
  onRendered?: ChatCallback;
}

export default function ChatMessageList({
  messages,
  isSending,
  librariesLoaded,
  textsZh,
  textsEn,
  sourceHintsByMessageIndex = {},
  sourceHintsHeading,
  sourceHintsAriaLabel,
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
          sourceHints={sourceHintsByMessageIndex[idx]}
          sourceHintsHeading={sourceHintsHeading}
          sourceHintsAriaLabel={sourceHintsAriaLabel}
        />
      );
    }
    return (
      <div key={idx} className="c-message c-user-message">
        {msg.content}
      </div>
    );
  });
}
