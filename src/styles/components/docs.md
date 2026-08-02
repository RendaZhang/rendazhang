# Docs Layout Styles

## Tokens

- `--measure`
- `--color-bg`
- `--color-surface`
- `--color-text`
- `--color-palette-surface`
- `--color-palette-border`
- `--color-border-soft`
- `--border-1`
- `--border-width-hairline`
- `--radius-xs`
- `--radius-s`
- `--shadow-elevation-1`
- `--shadow-elevation-2`
- `--shadow-md-table`
- `--focus-ring`
- `--font-size-1`, `--font-size-4`
- `--line-height-5`
- `--space-1`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`
- `--space-7`
- `--space-8`
- `--space-10`
- `--duration-fast`
- `--easing-standard`

## States

- Markdown links use tokenized hover, active, and focus-visible feedback.
- The generated README table of contents is styled as the docs entry panel while preserving its links.
- The entry panel is height-capped with internal scrolling so body content peeks into the first viewport.
- Code blocks, inline code, blockquotes, tables, images, and Mermaid containers use the page token surface.

## Container

- Main content area `main.c-docs-main` is constrained by `--measure`, centered, and padded with tokenized desktop/mobile spacing.
- The PersonalWeb introduction uses one unframed lead band, three scan-friendly project sections,
  direct implementation links, a concise limitation, and existing destination actions.
- The three project sections and the implementation/limitation grid collapse to one column without
  horizontal overflow on narrow screens.
