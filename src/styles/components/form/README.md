# Form Styles

## Tokens
- `--color-surface`
- `--border-0`
- `--radius-xs`
- `--radius-s`
- `--space-1`
- `--space-2`
- `--space-4`
- `--space-5`
- `--focus-ring`
- `--color-error`
- `--color-success`
- `--shadow-login`

## States
- `.c-form-control:focus-visible` applies `--focus-ring`
- `.c-password-toggle:focus-visible` uses `--focus-ring`
- `.c-form-control:disabled` inherits disabled styling
- `.c-invalid-feedback` and `.c-valid-feedback` use semantic color tokens

## Container
Authentication forms use `container-type: inline-size` and adjust width via container queries. Fields span the full container width while remaining within a max-width wrapper.
