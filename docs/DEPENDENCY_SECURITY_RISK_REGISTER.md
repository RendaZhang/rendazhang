<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Dependency Security Risk Register](#dependency-security-risk-register)
  - [Current Evidence](#current-evidence)
  - [Active Risk Register](#active-risk-register)
  - [Escalation Thresholds](#escalation-thresholds)
  - [Maintenance Cadence](#maintenance-cadence)
  - [Owner Action Rules](#owner-action-rules)
  - [Astro 7 Precheck And Implementation Result](#astro-7-precheck-and-implementation-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Dependency Security Risk Register

- **Author**: Renda Zhang
- **Last Updated**: July 05, 2026, 10:38 (UTC+08:00)
- **Scope**: public-safe dependency and security risk decisions for the PersonalWeb frontend.

This register records the current audit evidence, accepted residuals, escalation thresholds, and
owner actions after the controlled Astro 7 implementation. It is intentionally
documentation only: it does not change package versions, lockfiles, CI workflows, runtime pins,
frontend behavior, backend behavior, Nginx configuration, telemetry, analytics, cookies, or
production services.

Do not add secrets, private advisory notes, credentials, private logs, private IP allowlists, or
server-only operational details to this document.

## Current Evidence

Read-only checks captured after the Slice 13.6 controlled Astro 7 upgrade:

| Check | Result | Decision |
| --- | --- | --- |
| `npm audit --omit=dev --audit-level=low` | 0 findings | Local production audit is clear |
| `npm audit --audit-level=low` | 0 findings | Local full audit is clear |
| Dependabot alerts | Previous low `esbuild` alert should refresh against the new lockfile after push | Recheck after GitHub dependency graph refresh if the alert remains open |
| Latest deploy runs | Last 3 `deploy.yml` runs on `master` completed successfully | No release blocker |
| Runtime baseline | Node `>=24.17 <25`, npm `>=11 <12`; CI uses Node `24.17.0` | Keep pinned |

Current relevant package path:

```text
astro@7.0.6 -> vite@8.1.3 -> esbuild@0.28.1
```

The prior low Astro/esbuild residual is resolved locally by the controlled Slice 13.6 upgrade. The
force-fix command remains disallowed because future `npm audit fix --force` output may again mix
major framework or runtime changes into what should be a focused maintenance decision.

## Active Risk Register

| Risk | Current decision | Reason | Revisit trigger |
| --- | --- | --- | --- |
| Low `esbuild` advisory through Astro/Vite | Resolved locally | Slice 13.6 moved the frontend to `astro@7.0.6`, `vite@8.1.3`, and `esbuild@0.28.1`; both local audit commands now return zero findings | New audit finding, Dependabot alert that still maps to the new lockfile, severity increase, or exploitability change |
| `npm audit fix --force` path | Still disallowed | Force-fixing can mix a major framework upgrade into a security maintenance action; Slice 13.6 used explicit package targets instead | A future urgent patch slice explicitly scopes and justifies the command, which should remain exceptional |
| Dependabot low `esbuild` alert | Recheck after GitHub refresh | Local lockfile evidence is clear, but hosted alert state can lag until dependency graph processing completes | Alert remains open against the new `esbuild@0.28.1` path, changes severity, or changes dependency path |
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

Slice 13.5 Astro 7 Upgrade Precheck was opened because:

- The Astro/esbuild chain still has no safe non-major remediation path.
- Dependabot/npm continue to point to Astro 7 as the available fix.
- Recent deploys are otherwise healthy enough that a precheck can isolate framework risk.

The precheck produced an explicit `Go`, and Slice 13.6 implemented it with explicit targets. Do not
combine future dependency maintenance with unrelated workflow, Chat Guide, backend, Nginx, runtime,
or telemetry changes.

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

- If both npm audit commands return zero findings, keep routine monitoring and update this document
  only when evidence changes.
- If a non-major official patch path appears, split a focused dependency patch slice and validate it
  before pushing.
- If a future audit path requires another major framework or runtime move, start with a precheck and
  Go/No-Go decision instead of using a force-fix command.
- If a high or critical production finding appears, prioritize an urgent patch slice before routine
  CI hygiene, docs polish, or feature work.
- Never run `npm audit fix --force` as a routine action in this project.
- Never mix dependency upgrades with Chat Guide, Chat Widget protocol, telemetry, auth/profile,
  contact, backend, Nginx, or production service behavior changes unless the slice explicitly scopes
  that combined risk.

## Astro 7 Precheck And Implementation Result

Slice 13.5 produced a `Go` decision for a separate implementation slice, and Slice 13.6 implemented
the approved target set. The result is documented in
[Astro 7 Upgrade Precheck](./ASTRO_7_UPGRADE_PRECHECK.md).

The implemented boundary is:

- Used explicit package targets: `astro@7.0.6`, `@astrojs/react@6.0.1`, and `typescript@5.9.3`.
- Do not run `npm audit fix --force`.
- Kept Sentry package versions unchanged at `10.58.0`.
- Verified Vite 8/Rolldown output, strict Astro compiler checks, Sentry source-map upload, CSP
  executable inline hashes, Chat Widget iframe readiness, `/deepseek_chat/`, `/docs/`, and
  `/certifications/`.
- Avoided Nginx CSP hash changes by moving the `/deepseek_chat/` embedded-page marker to the
  external same-origin `/js/deepseek-embed.js` script.
- Reduced local npm audit evidence to zero findings.
