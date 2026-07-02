import {
  CHAT_PRESET_QUESTION_IDS,
  trackVisitorEvent,
  type ChatPresetQuestionId
} from '../../services/visitorEvents';

type ChatPresetQuestionTexts = Readonly<Record<ChatPresetQuestionId, string>>;
type TrackPresetClick = (
  name: 'chat_preset_question_clicked',
  payload: { presetId: ChatPresetQuestionId }
) => unknown;

export interface ChatPresetQuestionsProps {
  heading: string;
  description: string;
  questions: ChatPresetQuestionTexts;
  disabled?: boolean;
  onSelect: (presetId: ChatPresetQuestionId, question: string) => void;
  trackPresetClick?: TrackPresetClick;
}

export default function ChatPresetQuestions({
  heading,
  description,
  questions,
  disabled = false,
  onSelect,
  trackPresetClick = trackVisitorEvent
}: ChatPresetQuestionsProps) {
  const handleSelect = (presetId: ChatPresetQuestionId) => {
    trackPresetClick('chat_preset_question_clicked', { presetId });
    onSelect(presetId, questions[presetId]);
  };

  return (
    <section className="c-chat-presets" aria-labelledby="chat-preset-heading">
      <div className="c-chat-presets-copy">
        <h2 className="c-chat-presets-title" id="chat-preset-heading">
          {heading}
        </h2>
        <p className="c-chat-presets-description">{description}</p>
      </div>
      <div className="c-chat-preset-list" role="list" aria-label={heading}>
        {CHAT_PRESET_QUESTION_IDS.map((presetId) => (
          <button
            className="c-chat-preset-button"
            disabled={disabled}
            key={presetId}
            onClick={() => handleSelect(presetId)}
            type="button"
          >
            {questions[presetId]}
          </button>
        ))}
      </div>
    </section>
  );
}
