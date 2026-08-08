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
- `--duration-fast`
- `--duration-normal`
- `--easing-standard`

## States
- Links and buttons change background and text color on `:hover`
- `:active` uses `--color-subtle-bg-hover`
- `:focus-visible` adds `--focus-ring`
- Avatar links scale and brighten on `:hover` and shrink on `:active`
- Hamburger menu lines transform using motion tokens when `.is-open`
- The mobile drawer and backdrop sit above both Chat Widget surfaces while open
- `html[data-logged-in='true']` swaps the home link to a logged-in icon and text

## Container
The `.c-nav-container` wrapper declares `container-type: inline-size` for responsive queries. Wide
containers keep Home on the logo and show the remaining shared destinations directly; containers at
`64rem` and below use the compact drawer trigger with Home included. The open drawer is portal-mounted,
locks document scrolling, bounds keyboard focus, and is removed when dismissed or when the viewport
crosses back into the desktop breakpoint.
