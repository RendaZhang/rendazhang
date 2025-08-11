# Navigation Styles

## Tokens
- `--color-nav-bg`
- `--color-nav-text`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--radius-s`
- `--shadow-elevation-3`
- `--focus-ring`
- `--color-subtle-bg`
- `--color-subtle-bg-hover`

## States
- Links and buttons change background and text color on `:hover`
- `:active` uses `--color-subtle-bg-hover`
- `:focus-visible` adds `--focus-ring`
- Hamburger menu lines transform using motion tokens when `.is-open`

## Container
The `nav` element declares `container-type: inline-size` for responsive queries. Side menus overlay the viewport and toggle visibility through the `is-open` state.
