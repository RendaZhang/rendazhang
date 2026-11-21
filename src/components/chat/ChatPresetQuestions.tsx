import {
  CHAT_PRESET_QUESTION_IDS,
  trackVisitorEvent,
  type ChatPresetQuestionId
} from '../../services/visitorEvents';

type ChatPresetTopicTexts = Readonly<Record<ChatPresetQuestionId, string>>;
type TrackPresetClick = (
  name: 'chat_preset_question_clicked',
  payload: { presetId: ChatPresetQuestionId }
) => unknown;

export interface ChatPresetQuestionsProps {
  label: string;
  topics: ChatPresetTopicTexts;
  selectedPresetId: ChatPresetQuestionId | null;
  disabled?: boolean;
  onSelect: (presetId: ChatPresetQuestionId) => void;
  trackPresetClick?: TrackPresetClick;
}

export default function ChatPresetQuestions({
  label,
  topics,
  selectedPresetId,
  disabled = false,
  onSelect,
  trackPresetClick = trackVisitorEvent
}: ChatPresetQuestionsProps) {
  const handleSelect = (presetId: ChatPresetQuestionId) => {
    trackPresetClick('chat_preset_question_clicked', { presetId });
    onSelect(presetId);
  };

  return (
    <section className="c-chat-presets" aria-label={label}>
      <ul className="c-chat-preset-list">
        {CHAT_PRESET_QUESTION_IDS.map((presetId) => (
          <li key={presetId}>
            <button
              aria-pressed={selectedPresetId === presetId}
              className="c-chat-preset-button"
              data-preset-id={presetId}
              disabled={disabled}
              onClick={() => handleSelect(presetId)}
              type="button"
            >
              {topics[presetId]}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
