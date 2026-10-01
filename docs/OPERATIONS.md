<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Operations Maintenance Guide](#operations-maintenance-guide)
  - [Repository Status](#repository-status)
  - [Frontend Maintenance](#frontend-maintenance)
  - [Frontend Deploy Inspection](#frontend-deploy-inspection)
  - [Backend Maintenance](#backend-maintenance)
  - [Nginx Maintenance](#nginx-maintenance)
  - [Local Roadmap Maintenance](#local-roadmap-maintenance)
  - [Commit And Push Rules](#commit-and-push-rules)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Operations Maintenance Guide

- **Author**: Renda Zhang
- **Last Updated**: October 01, 2026, 11:03 (UTC+08:00)
- **Scope**: public-safe command index for routine PersonalWeb maintenance across the frontend,
  backend, Nginx config mirror, local roadmap, and read-only production checks.

This guide collects routine operations commands that are safe to document in public repositories.
It intentionally avoids secrets, private IP allowlists, credentials, cookies, private logs, private
environment values, and one-off server incident details.

Use this guide as an index, not as permission to change production. Production writes, backend
service restarts, Nginx reloads, and server worktree fast-forwards should happen only when a slice
explicitly scopes them.

## Repository Status

Run these before changing any PersonalWeb repo:

```bash
cd /Users/renda/Documents/PersonalWeb/rendazhang
git status --short --branch

cd /Users/renda/Documents/PersonalWeb/python-cloud-chat
git status --short --branch

cd /Users/renda/Documents/PersonalWeb/nginx-conf
git status --short --branch
```

Expected clean status:

```text
## master...origin/master
```

If unrelated changes exist, preserve them and scope the current slice around them.

## Frontend Maintenance

Repository:

```bash
cd /Users/renda/Documents/PersonalWeb/rendazhang
```

Routine validation:

```bash
npm run sync
npm run lint
npm run typecheck
npm run check
```

Broader test gates:

```bash
npm run test:coverage
npm run smoke:browser
pre-commit run --all-files
```

Use `npm ci` to reproduce CI installs. Use `npm install` only when intentionally changing
dependencies and committing the updated lockfile.

Dependency audit status:

```bash
npm audit --omit=dev --audit-level=low
npm audit --audit-level=low
```

The audit commands may exit non-zero when findings exist. Treat the exit as status to inspect, not
as permission to run `npm audit fix --force`. As of Slice 13.6, both local audit commands are clear
after the controlled Astro 7 upgrade. Future findings should still be handled through the current
accepted residuals, escalation thresholds, and owner actions recorded in
[Dependency Security Risk Register](./DEPENDENCY_SECURITY_RISK_REGISTER.md).

Browser smoke:

```bash
npm run smoke:browser
```

This command builds with `SKIP_SENTRY=true`, launches the local preview harness, and checks public
page hydration, Chat Widget iframe readiness, theme state, and selected browser console signals.

## Frontend Deploy Inspection

Pushing `master` in `rendazhang` triggers `.github/workflows/deploy.yml`. The same workflow can
also be started manually through `workflow_dispatch`.

List recent deploys:

```bash
gh run list --workflow deploy.yml --branch master --limit 3
```

Inspect the latest run:

```bash
run_id=$(gh run list --workflow deploy.yml --branch master --limit 1 --json databaseId --jq '.[0].databaseId')
gh run view "$run_id" --json status,conclusion,createdAt,updatedAt,url,headSha
```

Save and inspect deploy logs without flooding the terminal:

```bash
gh run view "$run_id" --log > /tmp/personalweb-deploy-"$run_id".log
rg -n -i "warning|error|failed|deprecated|UNKNOWN STEP" /tmp/personalweb-deploy-"$run_id".log
```

Current accepted deploy-log noise:

- Vite may emit `Some chunks are larger than 500 kB after minification` for Mermaid dynamic chunks.
  This is documented in [Testing](./TESTING.md#%E6%9E%84%E5%BB%BA%E4%BD%93%E7%A7%AF%E4%B8%8E-chunk-warning).
- Storage and auth tests intentionally exercise failure paths, so Vitest output may include
  messages such as `getWebStorage failed`, `Unauthorized`, or `Reset failed`.
- `softprops/action-gh-release` may retry because a newly created tag is not immediately
  discoverable, then continue with the created release.
- `peaceiris/actions-gh-pages` may print cleanup noise such as `No such remote: 'origin'`.
- `gh run view --log` may label recent logs as `UNKNOWN STEP`; confirm the run conclusion and
  workflow step names before treating this as a workflow defect.
- Sentry source-map upload can print an early "no matching sources" warning before the later source
  map upload report and success line.
- The CDN purge script contains an `::warning::` branch in the printed shell body. Treat it as a
  warning only when the branch actually executes and the purge response is not successful.

Unexpected log lines, failed conclusions, missing release artifacts, failed CDN purge, or new
dependency/runtime warnings should be triaged in a focused follow-up slice.

## Backend Maintenance

Repository:

```bash
cd /Users/renda/Documents/PersonalWeb/python-cloud-chat
```

Routine validation:

```bash
python -m compileall app.py app_auth.py db.py mailer.py models.py
ruff check .
black --check .
python -m unittest discover -s tests
pre-commit run --all-files
```

Normal backend releases are automatic: push `master`, then inspect the matching
`backend-ci.yml` run. After quality checks, the workflow synchronizes the exact source SHA,
updates the environment only when requirements change, and restarts only `cloudchat.service`
when runtime code, dependencies, the canonical unit, or an explicit restart request require it.
Documentation-only changes synchronize without a restart. Pull requests never deploy.

```bash
gh run list --repo RendaZhang/python-cloud-chat --workflow backend-ci.yml --branch master --limit 3
gh run view <matching-run-id> --repo RendaZhang/python-cloud-chat --log
```

Routine deployment does not need a manual server pull or restart. If the workflow fails, keep its
diagnostics and repair that specific failure through a normal commit; do not manually deploy to
hide it. Do not restart Nginx, Redis, PostgreSQL, PgBouncer, or unrelated services for backend work.

Public health check:

```bash
curl -sS -i https://www.rendazhang.com/cloudchat/auth/healthz
```

Expected healthy body:

```json
{"db":true,"ok":true,"redis":true}
```

## Nginx Maintenance

Repository:

```bash
cd /Users/renda/Documents/PersonalWeb/nginx-conf
```

Docs-only validation:

```bash
pre-commit run --all-files
```

Normal Nginx releases also start with a `master` push. `nginx-ci.yml` validates the repository,
synchronizes the exact source SHA, and runs production `nginx -t` plus a reload only when
configuration changes (or an explicit reload is requested). Documentation-only updates synchronize
without a syntax test or reload. Pull requests never deploy.

```bash
gh run list --repo RendaZhang/nginx-conf --workflow nginx-ci.yml --branch master --limit 3
gh run view <matching-run-id> --repo RendaZhang/nginx-conf --log
```

Do not copy a local directory over `/etc/nginx`, or manually pull/reload to hide a failed run.
The workflow preserves ignored server-local state. For cross-repository changes, deliver one repo
at a time and wait for its exact-SHA run and health checks before pushing the next.

Server-local state:

- `ip-blacklist.conf` is maintained on the server and intentionally ignored by Git.
- Certificates, private keys, environment files, backups, and private allowlists must not be
  committed or overwritten from the repo.

Read-only route/header checks:

```bash
curl -I https://www.rendazhang.com/
curl -I https://www.rendazhang.com/docs/
curl -I https://www.rendazhang.com/deepseek_chat/
curl -I https://www.rendazhang.com/certifications/
curl -I https://www.rendazhang.com/llms.txt
curl -sS -i https://www.rendazhang.com/cloudchat/auth/healthz
```

Use local server checks with `--resolve` only when an authorized Nginx config slice explicitly
requires server-side validation.

## Local Roadmap Maintenance

Local planning files live outside the public repos:

```text
/Users/renda/Documents/PersonalWeb/PERSONALWEB_ROADMAP.md
/Users/renda/Documents/PersonalWeb/EP_COMMANDS.md
```

Roadmap hygiene:

```bash
rg -n "[ \t]+$" /Users/renda/Documents/PersonalWeb/PERSONALWEB_ROADMAP.md
```

Update the roadmap when:

- active phase or slice changes;
- a slice moves to `Done`, `Partial`, `Ready`, `Blocked`, or `Backlog`;
- deploy/audit/production status changes materially;
- a follow-up slice is split, retired, or promoted;
- the copy-ready next slice packet becomes stale.

Keep local planning docs public-safe even though they are outside the public repos.

## Commit And Push Rules

General rules:

- Do not use `--no-verify`.
- Do not force push.
- Commit only scoped files for the current slice.
- Push public repos only after validation passes.
- Do not SSH, restart services, reload Nginx, or change production state unless the active slice
  explicitly scopes that action.

Docs-only public repo commits should use docs-scoped commit messages. If multiple public repos are
touched, commit each repo separately so frontend deploy, backend sync, and Nginx sync remain
independent.
