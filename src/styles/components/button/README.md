# Button Styles

## Tokens
- `--gradient-primary`
- `--color-subtle-bg`
- `--color-text-muted`
- `--color-white`
- `--radius-s`
- `--radius-l`
- `--space-3`
- `--space-6`
- `--shadow-elevation-2`
- `--focus-ring`

## States
- `:hover` brightens and lifts the button
- `:active` returns the button to its original position
- `:focus-visible` adds `--focus-ring` with existing shadow
- `:disabled` removes shadows and lowers opacity

## Container
Buttons are inline-flex elements and expand to fit their content. Chat buttons use a larger radius and padding but obey the same token-driven spacing.
