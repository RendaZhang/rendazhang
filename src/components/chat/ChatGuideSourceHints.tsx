import type { ChatGuideSourceHintGroup } from '../../content/chatGuideKnowledge';

interface ChatGuideSourceHintsProps {
  sourceHints?: ChatGuideSourceHintGroup;
  heading: string;
  ariaLabel: string;
}

export default function ChatGuideSourceHints({
  sourceHints,
  heading,
  ariaLabel
}: ChatGuideSourceHintsProps) {
  if (!sourceHints || sourceHints.hints.length === 0) {
    return null;
  }

  return (
    <aside className="c-chat-source-hints" aria-label={ariaLabel}>
      <div className="c-chat-source-hints-heading">{heading}</div>
      <ul className="c-chat-source-hint-list">
        {sourceHints.hints.map((hint) => (
          <li className="c-chat-source-hint-item" key={hint.id}>
            {hint.href ? (
              <a
                className="c-chat-source-hint-link"
                href={hint.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {hint.label}
              </a>
            ) : (
              <span className="c-chat-source-hint-label">{hint.label}</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
