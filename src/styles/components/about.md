# About Page Styles

## Tokens

- `--color-white`
- `--space-2`
- `--space-4`
- `--space-6`
- `--space-9`
- `--space-10`

## States

- None

## Container

- `.c-hero` centers the role, name, personal summary, and primary actions with token-based spacing.
- The existing portrait uses a component-scoped `object-position` adjustment at desktop and mobile
  sizes so the face remains visible without changing the image asset.
- `.c-home-proof-path-links` and `.c-skill-groups` use bordered responsive grids rather than nested
  cards; both collapse to one column on narrow screens.
- `body.c-about-page` resets flex alignment so content starts below the header.
