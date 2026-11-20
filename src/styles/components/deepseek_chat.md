# Deepseek Chat Styles

## Tokens

- Colors: `--color-surface`, `--color-subtle-bg`, `--color-subtle-bg-alt`, `--color-subtle-bg-hover`, `--color-text`, `--color-text-muted`, `--color-text-deep`, `--color-white`, `--color-border-muted`, `--color-gray-medium`
- Spacing: `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-7`, `--space-8`, `--space-10`
- Typography: `--font-size-0`, `--font-size-1`, `--font-size-2`, `--font-size-4`
- Borders & Radius: `--border-0`, `--border-1`, `--border-2`, `--radius-xs`, `--radius-l`
- Effects: `--shadow-elevation-1`, `--shadow-elevation-3`, `--focus-ring`, `--gradient-primary`
- Layout & Motion: `--header-height`, `--container-sm`, `--bp-sm`, `--duration-fast`, `--duration-normal`, `--duration-slow`, `--easing-standard`, `--overlay-dark-bg`

## States

- `.c-message-input` uses `:focus-visible` with `--focus-ring`.
- Buttons rely on shared chat button states defined in button styles.
- The composer uses a visible question label and a text-and-icon Send button. Both send and reset
  retain 44px targets when the actions wrap below the question field.
- `.c-chat-source-hints` renders controlled Chat Guide source labels inside assistant messages; links
  use tokenized chip styling and must remain relative public routes.

## Container

- `.c-chat-wrapper` is a paper-toned desk with a static header, using palette tokens for text, borders
  and focus. Container queries stack the topic cards above the composer in narrow pages and the iframe.
- Topic buttons fill an editable preview and mark the active topic with `aria-pressed`. Previewing
  a topic does not send the message. The explicit submit button and IME-safe Enter handler share
  the same submission path.
