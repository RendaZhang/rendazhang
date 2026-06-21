# AGENTS.md

Last updated: 2026-06-15

This file gives AI coding agents the project context needed to work safely in the
`rendazhang` frontend repository. The repository is public, so do not add
secrets, private host details, real environment values, SSH keys, cookies, or
tokens to this file or to any committed document.

## Project Role

- This repository contains the Astro + React + TypeScript frontend for
  `www.rendazhang.com`.
- The production site is a static build served by Nginx.
- Related repositories:
  - `python-cloud-chat`: CloudChat / AI chat backend APIs.
  - `nginx-conf`: production Nginx configuration and operations docs.

## First Steps For Every Task

1. Run `git status --short --branch`.
2. Read the relevant docs before changing behavior:
   - `README.md`
   - `docs/CI_CD.md`
   - `docs/GIT_WORKFLOW.md`
   - `docs/TESTING.md`
   - `docs/STYLE_GUIDE.md`
   - `docs/TROUBLESHOOTING.md`
3. Keep changes scoped. Do not change backend or Nginx config from this repo.
4. Do not use `--no-verify` unless the reason is explicit and documented.
5. Do not force push.

## Local Development

- Use Node.js 24 for parity with GitHub Actions.
- Runtime version files are committed for local tooling:
  - `.nvmrc` for nvm/fnm-compatible Node selection.
  - `.mise.toml` for mise-based Node selection.
- Install with `npm ci` when reproducing CI. Use `npm install` only when
  intentionally changing dependencies and committing the updated lockfile.
- Common commands:

```bash
mise install
mise exec -- npm ci
npm run dev
npm run lint
npm run typecheck
npm run check
npm run test:coverage
SKIP_SENTRY=true npm run build
npm run preview
```

## Architecture Notes

- Keep the site content-first and static-first. Use React islands only where
  interactive UI is needed.
- `src/layouts/BaseLayout.astro` owns global document structure, metadata,
  styles, and top-level islands.
- The current global interactive state is split across React providers,
  `document.documentElement.dataset`, storage, and DOM events. If adding
  features such as multi-palette theme switching or complex cross-island
  interactions, first design a small shared client-state boundary rather than
  duplicating state in each island.
- The current theme model is light/dark. A future theme-color feature should
  separate theme mode from palette/accent tokens.
- Chat Widget behavior is production-critical:
  - The homepage toggle loads the same-origin iframe `/deepseek_chat/`.
  - `postMessage` communication must remain same-origin.
  - Do not break iframe readiness, loading skeleton removal, or embedded chat
    input focus behavior.
- Credly certificate pages require iframe support for `https://www.credly.com`.

## CSP And Hydration

- Production CSP is enforced by Nginx, not by this repository alone.
- Avoid new inline executable scripts. Prefer external scripts or framework
  output that has been reviewed against the Nginx CSP.
- If hydration directives, Sentry behavior, Astro version, or inline scripts
  change, verify browser console output after build and deployment.
- Preserve the known frame policy requirements:
  - `frame-src 'self' https://www.credly.com`
  - `frame-ancestors 'self'`
  - `X-Frame-Options: SAMEORIGIN`

## Deployment

- Pushing to `master` triggers `.github/workflows/deploy.yml`.
- The workflow runs checks, builds `dist/`, deploys static files to the server,
  publishes the release branch/tag, and purges CDN cache.
- The frontend static directory on the server is not a Git worktree. Do not try
  to deploy the frontend with `git pull` on `/var/www/html`.
- After pushing to `master`, verify the GitHub Actions run and then perform
  read-only production checks, for example:

```bash
gh run list --workflow deploy.yml --branch master --limit 1
curl -I https://www.rendazhang.com/
curl -I https://www.rendazhang.com/deepseek_chat/
```

## Documentation Rules

- Public docs may mention repository names, public paths, public URLs, and
  placeholder environment variable names.
- Public docs must not include real secret values, private keys, cookies,
  session data, internal one-off credentials, or local-only machine state.
- When deployment, CSP, hydration, theme architecture, or Chat Widget behavior
  changes, update the relevant docs in the same commit.

## Final Report Checklist

When handing work back, include:

- What changed.
- What validation commands ran.
- Deployment status.
- Any remaining risk or follow-up slice.
