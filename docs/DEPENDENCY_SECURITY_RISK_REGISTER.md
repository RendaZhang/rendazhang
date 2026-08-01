<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Dependency Security Risk Register](#dependency-security-risk-register)
  - [Current Evidence](#current-evidence)
  - [Slice 15.1 Security Patch Result](#slice-151-security-patch-result)
  - [Active Risk Register](#active-risk-register)
  - [Escalation Thresholds](#escalation-thresholds)
  - [Maintenance Cadence](#maintenance-cadence)
  - [Owner Action Rules](#owner-action-rules)
  - [Astro 7 Precheck And Implementation Result](#astro-7-precheck-and-implementation-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Dependency Security Risk Register

- **Author**: Renda Zhang
- **Last Updated**: August 01, 2026, 13:59 (UTC+08:00)
- **Scope**: public-safe dependency and security risk decisions for the PersonalWeb frontend.

This register records the current audit evidence, accepted residuals, escalation thresholds, and
owner actions after the controlled Astro 7 implementation and the Slice 15.1 production dependency
security patch. It is intentionally public-safe: it records package and validation decisions without
changing CI workflows, runtime pins, frontend behavior, backend behavior, Nginx configuration,
telemetry, analytics, cookies, or production services.

Do not add secrets, private advisory notes, credentials, private logs, private IP allowlists, or
server-only operational details to this document.

## Current Evidence

Read-only checks captured before Slice 15.1 reported seven production findings: five high, one
moderate, and one low. The affected production packages were `astro`, Sentry's transitive
`brace-expansion` path, `dompurify`, `js-yaml`, `postcss`, `sharp`, and `svgo`. Full audit also
reported dev-only `fast-uri` and additional dev-only `brace-expansion` instances.

After the Slice 15.1 patch:

| Check | Result | Decision |
| --- | --- | --- |
| `npm audit --omit=dev --audit-level=low` | 0 findings | Local production audit is clear |
| `npm audit --audit-level=low` | 0 findings | Local full audit is clear, including dev-only advisory paths |
| Direct production targets | `astro@7.1.6`, `@sentry/astro@10.69.0`, `@sentry/react@10.69.0`, `dompurify@3.4.12`, `sharp@0.35.3` | Explicit package targets; no blind audit fix |
| Direct build target | `postcss@8.5.25` | Explicit target for the direct build dependency |
| Reviewed leaf updates | `@sentry/vite-plugin@5.4.0`, `@sentry/bundler-plugins@10.69.0`, `minimatch@10.2.6`, `brace-expansion@5.0.9` / `1.1.18`, `fast-uri@3.1.5`, `js-yaml@4.3.1`, `svgo@4.0.2` | Cleared remaining production and full-audit advisory nodes without adding direct dependencies |
| Sharp compatibility | `sharp@0.35.3` with libvips packages `1.3.2` | Accepted as a deliberate major after Node 24 support and image/build validation |
| Runtime baseline | Node `>=24.17 <25`, npm `>=11 <12`; CI uses Node `24.17.0` | Keep pinned |

Current relevant package path:

```text
astro@7.1.6 -> vite@8.1.3 -> postcss@8.5.25
astro@7.1.6 -> js-yaml@4.3.1 / svgo@4.0.2 / sharp@0.35.3
@sentry/astro@10.69.0 -> @sentry/vite-plugin@5.4.0 -> @sentry/bundler-plugins@10.69.0 -> minimatch@10.2.6 -> brace-expansion@5.0.9
```

The prior low Astro/esbuild residual remains resolved by the controlled Slice 13.6 upgrade. The
August 2026 production findings are resolved by Slice 15.1. The force-fix command remains
disallowed because future `npm audit fix --force` output may again mix major framework, runtime, or
unrelated dependency changes into what should be a focused maintenance decision.

## Slice 15.1 Security Patch Result

Slice 15.1 used explicit package targets plus a reviewed lockfile leaf update. It did not run
`npm audit fix` or `npm audit fix --force`.

| Finding owner | Baseline | Patched resolution | Notes |
| --- | --- | --- | --- |
| Astro reflected XSS advisory | `astro@7.0.6` | `astro@7.1.6` | Same major/minor patch line; keeps Astro 7 static build model |
| DOMPurify custom-element advisory | `dompurify@3.4.11` | `dompurify@3.4.12` | Direct production dependency and Mermaid dedupe path both resolve to the patched version |
| PostCSS source-map advisory | `postcss@8.5.16` | `postcss@8.5.25` | Direct build dependency; all visible PostCSS paths dedupe to the patched version |
| Sentry transitive brace-expansion path | `@sentry/astro@10.58.0`, `@sentry/react@10.58.0`, `@sentry/vite-plugin@5.3.0`, `brace-expansion@5.0.6` | `@sentry/astro@10.69.0`, `@sentry/react@10.69.0`, `@sentry/vite-plugin@5.4.0`, `brace-expansion@5.0.9` | Preserves `release.inject: false`; plugin subtree now uses the current Sentry bundler package path |
| js-yaml CPU advisory | `js-yaml@4.2.0` | `js-yaml@4.3.1` | Resolved through Astro's patched dependency range and lockfile dedupe |
| SVGO removeScripts advisory | `svgo@4.0.1` | `svgo@4.0.2` | Resolved as an Astro transitive package without adding a direct dependency |
| Sharp/libvips inherited CVEs | `sharp@0.34.3`, libvips packages `1.2.0` | `sharp@0.35.3`, libvips packages `1.3.2` | Deliberate major package move; Node `>=20.9.0` engine supports the pinned Node 24 runtime |
| Full-audit dev-only leaf findings | `fast-uri@3.1.2`, dev-only `brace-expansion` `1.1.15` / `5.0.6` | `fast-uri@3.1.5`, `brace-expansion@1.1.18` / `5.0.9` | Cleared the full audit gate without adding direct dependencies or changing frontend runtime behavior |

Validation expectations for this patch class:

- `npm ci` must succeed from `package-lock.json`.
- Both production and full audit commands must return zero findings.
- Sharp must be proven by image-generation, static build, generated asset inspection, browser smoke,
  and desktop/mobile Browser QA.
- Sentry source-map and CSP behavior must be checked in build/deploy logs and browser console.
- If executable inline script output stops matching the current Nginx CSP allowlist, stop before
  deployment and split a coordinated Nginx CSP slice.

## Active Risk Register

| Risk | Current decision | Reason | Revisit trigger |
| --- | --- | --- | --- |
| August 2026 production advisories | Resolved by Slice 15.1 | Explicit targets and reviewed lockfile leaf updates cleared production and full audits without `npm audit fix` or force-fix behavior | New audit finding, Dependabot alert, package path change, severity increase, or deploy/build regression |
| Sharp 0.35 major compatibility | Accepted for the current frontend | The package supports Node 24, remains allowed by Astro's optional dependency range, and is validated through the image/build/browser gates | Image generation failure, changed Sharp install behavior on CI/Linux, broken hero assets, or Astro image integration change |
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
NODE_ROOT="$(mise where node)"
"$NODE_ROOT/bin/node" --version
"$NODE_ROOT/bin/node" "$NODE_ROOT/lib/node_modules/npm/bin/npm-cli.js" --version
"$NODE_ROOT/bin/node" "$NODE_ROOT/lib/node_modules/npm/bin/npm-cli.js" audit --omit=dev --audit-level=low
"$NODE_ROOT/bin/node" "$NODE_ROOT/lib/node_modules/npm/bin/npm-cli.js" audit --audit-level=low
gh run list --workflow deploy.yml --branch master --limit 3
```

The explicit absolute `node .../npm-cli.js` form is useful when a non-interactive shell's `npm`
shebang would otherwise resolve through a system Node version. Dependency evidence should use the
pinned project runtime, not whichever `node` happens to appear first in the shell `PATH`.

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
