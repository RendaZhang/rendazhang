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
- Icon buttons `.c-send-btn` and `.c-reset-btn` maintain a square aspect ratio and resize on small screens.

## Container

- `.c-chat-wrapper` uses container queries and tokenized spacing to layout chat interface.
