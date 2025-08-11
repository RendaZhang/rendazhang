# GitHub Markdown Styles

This stylesheet provides GitHub-flavored Markdown presentation while aligning measurements with the project's design tokens.

## Token Usage

- **Color tokens**: references `--md-color-*` variables which map to global color tokens such as `--color-surface` and `--color-text-deep`.
- **Spacing tokens**: uses the `--space-*` scale for icon dimensions and margins (e.g., `var(--space-4)` for anchor icons, `calc(var(--space-10) / 2)` for side margins).
- **Border and outline tokens**: standard border variables supply consistent line widths and colors.

No component-specific overrides are required; all sizing and colors are derived from shared tokens to support theming and dark mode.
