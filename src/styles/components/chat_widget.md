# Chat Widget Styles

## Tokens

- `--gradient-primary`
- `--color-white`
- `--color-surface`, `--color-palette-surface`, `--color-palette-surface-strong`,
  `--color-palette-border`
- `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-7`,
  `--space-8`, `--space-9`, `--space-10`
- `--radius-l`, `--radius-m`, `--border-width-hairline`
- `--shadow-elevation-2`, `--shadow-elevation-3`, `--shadow-dialog`
- `--duration-normal`, `--duration-slow`, `--easing-standard`, `--easing-entrance`
- `--focus-ring`

## States

- Hover and active states adjust shadow, brightness, and press depth via tokens.
- `aria-expanded='true'` keeps the launcher visually connected to the open panel.
- Focus-visible preserves `--focus-ring` alongside the palette-aware shell border.
- The iframe fades and settles only after the existing same-origin `chat-enhancement-ready` signal.
- Reduced motion disables launcher, panel, and iframe transitions.

## Container

- Floating button and panel are sized and positioned with spacing tokens.
- The panel uses a palette-aware border/surface and mobile gutters while preserving the same iframe
  route and ready skeleton behavior.
- Loading skeleton structure is scoped to `.c-chat-widget-frame-wrapper` so the shared Chat page
  loading indicator keeps its existing behavior.
