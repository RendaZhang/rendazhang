# Markdown Dark Mode Styles

This stylesheet mirrors `github-markdown-light.css` but scopes all rules to `html[data-theme='dark']` and maps the variables to the dark palette.

## Token Usage

- **Color tokens**: `--color-md-bg`, `--color-md-text`, `--color-md-link`, `--color-md-table-border`, `--color-border-soft`, `--color-warning`, `--color-text-muted`, `--color-subtle-bg`, `--color-border-muted`.
- **Spacing and typography tokens**: inherits the global `--space-*` and `--font-size-*` scales used by the light stylesheet.

## Container

- Activated when the `<html>` element includes `data-theme="dark"`, providing a GitHub-flavored Markdown experience optimized for dark mode.
