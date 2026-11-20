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
  heading: string;
  description: string;
  topics: ChatPresetTopicTexts;
  selectedPresetId: ChatPresetQuestionId | null;
  disabled?: boolean;
  onSelect: (presetId: ChatPresetQuestionId) => void;
  trackPresetClick?: TrackPresetClick;
}

export default function ChatPresetQuestions({
  heading,
  description,
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
    <section className="c-chat-presets" aria-labelledby="chat-preset-heading">
      <div className="c-chat-presets-copy">
        <h2 className="c-chat-presets-title" id="chat-preset-heading">
          {heading}
        </h2>
        <p className="c-chat-presets-description">{description}</p>
      </div>
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
