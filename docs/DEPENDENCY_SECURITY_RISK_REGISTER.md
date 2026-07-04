<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Dependency Security Risk Register](#dependency-security-risk-register)
  - [Current Evidence](#current-evidence)
  - [Active Risk Register](#active-risk-register)
  - [Escalation Thresholds](#escalation-thresholds)
  - [Maintenance Cadence](#maintenance-cadence)
  - [Owner Action Rules](#owner-action-rules)
  - [Astro 7 Boundary](#astro-7-boundary)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Dependency Security Risk Register

- **Author**: Renda Zhang
- **Last Updated**: July 04, 2026, 13:05 (UTC+08:00)
- **Scope**: public-safe dependency and security risk decisions for the PersonalWeb frontend.

This register records the current audit evidence, accepted residuals, escalation thresholds, and
owner actions before any Astro 7 precheck or dependency upgrade. It is intentionally documentation
only: it does not change package versions, lockfiles, CI workflows, runtime pins, frontend behavior,
backend behavior, Nginx configuration, telemetry, analytics, cookies, or production services.

Do not add secrets, private advisory notes, credentials, private logs, private IP allowlists, or
server-only operational details to this document.

## Current Evidence

Read-only checks captured on July 04, 2026:

| Check | Result | Decision |
| --- | --- | --- |
| `npm audit --omit=dev --audit-level=low` | 2 low findings in the `astro` -> `esbuild` chain | Accepted residual; do not force-fix |
| `npm audit --audit-level=low` | Same 2 low findings; no additional dev-only findings | Accepted residual; continue monitoring |
| Dependabot alerts | 1 open low alert for `esbuild` in `package-lock.json` | Track as the same Astro/esbuild residual |
| Latest deploy runs | Last 3 `deploy.yml` runs on `master` completed successfully | No release blocker |
| Runtime baseline | Node `>=24.17 <25`, npm `>=11 <12`; CI uses Node `24.17.0` | Keep pinned |

Current relevant package path:

```text
astro@6.4.8 -> vite@7.3.5 -> esbuild@0.27.7
```

Npm currently reports that fixing all audit findings requires `npm audit fix --force`, which would
install `astro@7.0.6`. That is a breaking framework upgrade path, not a routine low-risk security
patch.

## Active Risk Register

| Risk | Current decision | Reason | Revisit trigger |
| --- | --- | --- | --- |
| Low `esbuild` advisory through Astro/Vite | Accept temporarily | The public site is statically built and the advisory maps to dev-server behavior; npm's available path is a major Astro upgrade | New non-major patch path, severity increase, exploitability change, or Astro 7 precheck result |
| `npm audit fix --force` would install Astro 7 | Disallowed | Force-fixing would mix a major framework upgrade into a security maintenance action | Slice 13.5 returns `Go` for Astro 7 |
| Dependabot open low alert for `esbuild` | Track as same residual | It matches local npm audit evidence and does not add a separate remediation path | Alert severity or dependency path changes |
| CI/runtime dependency deprecation | Monitor | Current deploys pass on pinned Node 24.17.0 and current workflow actions | Deploy logs show runtime deprecation, install warnings, or action compatibility failures |
| Production dependency high/critical finding | Not accepted | Higher-severity production dependency issues need an urgent patch decision | Any high/critical production audit or Dependabot alert |
| Dev-only audit finding | Case-by-case | Dev-only findings can still affect CI, docs builds, or local tooling, but should not be mixed into unrelated runtime changes | Full audit reports new moderate or higher dev-only findings |

## Escalation Thresholds

Split a focused urgent security patch slice when any of these happen:

- A production dependency reports a high or critical finding.
- A low or moderate finding gains a clear production exploit path for this static frontend.
- A public official patch path exists without a major framework upgrade or runtime pin change.
- Dependabot changes the open alert severity or the affected dependency path.
- GitHub Actions install, build, or deploy logs show a runtime or action deprecation that affects
  deployment reliability.
- A dependency finding touches Chat Widget iframe behavior, auth/profile/contact behavior,
  telemetry boundaries, Sentry/CSP behavior, or generated static assets.

Open Slice 13.5 Astro 7 Upgrade Precheck when:

- The Astro/esbuild chain still has no safe non-major remediation path.
- Dependabot/npm continue to point to Astro 7 as the available fix.
- Recent deploys are otherwise healthy enough that a precheck can isolate framework risk.

Do not proceed from precheck to implementation unless the precheck produces an explicit `Go`.

## Maintenance Cadence

Routine read-only checks:

```bash
cd /Users/renda/Documents/PersonalWeb/rendazhang
npm audit --omit=dev --audit-level=low
npm audit --audit-level=low
gh run list --workflow deploy.yml --branch master --limit 3
```

When dependency docs change, run the normal docs validation gate:

```bash
npm run sync
npm run lint
npm run typecheck
npm run check
pre-commit run --all-files
```

When a dependency or lockfile actually changes in a future slice, also run the broader frontend gate:

```bash
npm run test:coverage
npm run smoke:browser
```

Production read-only checks after a frontend docs deploy:

```bash
curl -I https://www.rendazhang.com/
curl -I https://www.rendazhang.com/docs/
curl -I https://www.rendazhang.com/deepseek_chat/
curl -sS -i https://www.rendazhang.com/cloudchat/auth/healthz
```

## Owner Action Rules

- If both npm audit commands still show only the known low Astro/esbuild residual, keep the risk
  accepted and update this document only when evidence changes.
- If a non-major official patch path appears, split a focused dependency patch slice and validate it
  before pushing.
- If the only available path remains Astro 7, run a precheck slice first; do not upgrade in the same
  slice as the audit decision.
- If a high or critical production finding appears, prioritize an urgent patch slice before routine
  CI hygiene, docs polish, or feature work.
- Never run `npm audit fix --force` as a routine action in this project.
- Never mix dependency upgrades with Chat Guide, Chat Widget protocol, telemetry, auth/profile,
  contact, backend, Nginx, or production service behavior changes unless the slice explicitly scopes
  that combined risk.

## Astro 7 Boundary

Astro 7 remains precheck-first. A future precheck should read official Astro, Vite, React
integration, Sentry, and CSP/hydration compatibility notes, then produce a `Go` or `No-Go` with:

- target package set;
- expected lockfile impact;
- Sentry source-map and CSP checks;
- Chat Widget iframe and `/deepseek_chat/` smoke checks;
- rollback plan;
- deploy-log and production read-only checks.

The implementation upgrade must be a separate slice after a `Go` decision.
