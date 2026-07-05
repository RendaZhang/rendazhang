<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Astro 7 Upgrade Precheck](#astro-7-upgrade-precheck)
  - [Decision](#decision)
  - [Slice 13.6 Implementation Result](#slice-136-implementation-result)
  - [Current Baseline](#current-baseline)
  - [Official Compatibility Notes](#official-compatibility-notes)
  - [Local Compatibility Findings](#local-compatibility-findings)
  - [Temporary Lockfile Probe](#temporary-lockfile-probe)
  - [Risk Assessment](#risk-assessment)
  - [Slice 13.6 Implementation Scope](#slice-136-implementation-scope)
  - [Validation Plan](#validation-plan)
  - [Deployment And Rollback Plan](#deployment-and-rollback-plan)
  - [Recheck Triggers](#recheck-triggers)
  - [Sources](#sources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Astro 7 Upgrade Precheck

- **Author**: Renda Zhang
- **Last Updated**: July 05, 2026, 10:38 (UTC+08:00)
- **Decision**: `Go` for a separate controlled Slice 13.6 implementation.
- **Scope**: frontend precheck plus the Slice 13.6 implementation result. This document does not
  change workflows, runtime pins, backend behavior, Nginx config, telemetry, analytics, cookies, or
  production services.

Keep this document public-safe. Do not add secrets, private logs, private IP allowlists,
credentials, private advisory metadata that requires authentication, private customer or employer
details, private server paths, or hidden operational details.

## Decision

Proceed with a controlled Astro 7 upgrade in a separate implementation slice.

The upgrade is justified because the current low `astro` / `esbuild` audit residual has no safe
non-major remediation path, the pinned frontend CI runtime already satisfies Astro 7 and Vite 8
engine requirements, and a temporary lockfile probe resolves the candidate Astro 7 package graph with
zero npm audit findings.

This is not permission to run `npm audit fix --force`. Slice 13.6 must use an explicit package target
set, inspect the lockfile diff, validate strict Astro compiler behavior, verify Sentry source-map
upload, verify CSP compatibility before deploy, and run browser smoke for the Chat Widget and
`/deepseek_chat/`.

## Slice 13.6 Implementation Result

Slice 13.6 implemented the approved target set under the pinned project runtime:

```text
Node 24.17.0
npm 11.13.0
```

Direct package targets:

```text
astro@7.0.6
@astrojs/react@6.0.1
typescript@5.9.3
```

The resulting lockfile resolved the expected transitive package graph:

| Package | Implementation resolution |
| --- | --- |
| `astro` | `7.0.6` |
| `@astrojs/react` | `6.0.1` |
| `vite` | `8.1.3` |
| `@vitejs/plugin-react` | `5.2.0` |
| `esbuild` | `0.28.1` |
| `typescript` | `5.9.3` |
| `@sentry/astro` | `10.58.0` |
| `@sentry/react` | `10.58.0` |

Implementation notes:

- `@sentry/astro` and `@sentry/react` stayed on `10.58.0`; no same-major Sentry patch was needed.
- `npm audit --omit=dev --audit-level=low` and full `npm audit --audit-level=low` both returned
  zero findings after the real install.
- Vite 8/Rolldown exposed an ineffective dynamic-import warning for `src/utils/highlight.ts`
  because the generated `src/utils/index.ts` barrel statically exported the same lazy-loaded module.
  `scripts/generateIndex.ts` now excludes that lazy-only highlighter from generated barrels.
- `src/pages/deepseek_chat.astro` now loads `/js/deepseek-embed.js` as an external same-origin script
  for the embedded-page body class. This avoids introducing a new executable inline module hash
  after Astro 7/Sentry build processing.
- CSP review found all executable inline scripts covered by the current Nginx hash allowlist after
  the external script change. Remaining unmatched hashes are `application/ld+json` structured data,
  which is non-executable and already documented as not the browser-console CSP blocker.
- `npm run build` still emits the accepted Vite large chunk warning for Mermaid dynamic chunks, now
  with Vite 8/Rolldown wording. The former `highlight.js` static-barrel warning is not accepted and
  was fixed.

## Current Baseline

| Area | Current state |
| --- | --- |
| Direct framework packages | `astro@6.4.8`, `@astrojs/react@5.0.7` |
| Key transitive packages | `vite@7.3.5`, `@vitejs/plugin-react@5.2.0`, `esbuild@0.27.7` |
| TypeScript | `typescript@5.8.3` |
| Sentry | `@sentry/astro@10.58.0`, `@sentry/react@10.58.0` |
| Runtime pin | Node `>=24.17 <25`, npm `>=11 <12`; `deploy.yml` uses Node `24.17.0` |
| Build/runtime shape | Static Astro pages with React islands, Sentry integration, sourcemaps enabled during build, sourcemaps deleted before static deploy |
| Nginx constraints | Long-cache `/_astro/` assets, same-origin `/deepseek_chat/`, same-origin Chat Widget iframe, CSP hashes for current inline scripts |
| Audit state | `npm audit --omit=dev --audit-level=low` and full `npm audit --audit-level=low` both report only the known two low `astro` / `esbuild` findings |

## Official Compatibility Notes

Astro 7 includes a Vite 8 upgrade. Vite 8 uses Rolldown by default instead of Rollup, so Slice 13.6
must treat bundling output, chunk warnings, generated asset names, and source-map upload behavior as
first-class validation areas.

Astro 7 introduces a stricter Rust-based Astro compiler. Invalid HTML in `.astro` files is more
likely to fail at build or check time. The current project uses Astro pages, inline scripts,
`set:html`, React islands, JSON-LD, and the Chat Widget iframe shell, so implementation must not rely
only on unit tests.

Astro 7 changes Markdown processing defaults and TypeScript template checking. This project renders
the docs page from imported Markdown strings and client-side Markdown enhancement, so `/docs/` needs
browser QA even if the upgrade does not directly use Astro Markdown collections.

The React integration remains the supported path through `@astrojs/react`; npm metadata shows the
current integration major for Astro 7 as `@astrojs/react@6.0.1`.

Sentry's Astro integration still supports Astro 7 in current npm metadata, and the current project
configuration keeps `release.inject: false`. Slice 13.6 still must prove source-map upload and final
production bundle cleanup because Vite 8/Rolldown can change sourcemap paths and build log wording.

## Local Compatibility Findings

Read-only local scans found no direct use of these known Astro 7 removal or rename risks:

- `Astro.request.headers`
- `Astro.request.canonicalURL`
- `Astro.request.params`
- `Astro.request.redirect`
- `import.meta.env.SITE`
- `markdown.shikiConfig`
- `src/fetch.ts`

Current hydration-sensitive areas that need manual and automated QA after the implementation:

- `src/layouts/BaseLayout.astro` inline theme/language script, JSON-LD, navigation island, Chat
  Widget island, and extra script handling.
- `src/pages/deepseek_chat.astro` same-origin iframe page and ready lifecycle.
- `src/pages/docs.astro` server-rendered Markdown containers plus client-side highlighting and
  Mermaid enhancement.
- `src/pages/certifications.astro` Credly iframe and certification effects.
- `src/pages/login.astro` inline redirect script.

The Nginx CSP currently allows a fixed set of inline script hashes. If Astro 7 changes the emitted
inline script text or introduces new inline runtime output, Slice 13.6 must resolve CSP before any
frontend deploy.

## Temporary Lockfile Probe

A temporary directory probe copied `package.json` and `package-lock.json` outside the repo and ran an
explicit package-lock-only install for:

```text
astro@7.0.6
@astrojs/react@6.0.1
typescript@5.9.3
```

Candidate lockfile results:

| Package | Candidate resolution |
| --- | --- |
| `astro` | `7.0.6` |
| `@astrojs/react` | `6.0.1` |
| `vite` | `8.1.3` |
| `@vitejs/plugin-react` | `5.2.0` |
| `esbuild` | `0.28.1` |
| `typescript` | `5.9.3` |
| `@sentry/astro` | `10.58.0` |
| `@sentry/react` | `10.58.0` |

Both temporary audit commands returned zero findings:

```bash
npm audit --omit=dev --audit-level=low
npm audit --audit-level=low
```

The probe also produced engine warnings because the local shell for the probe used Node `23.11.0`.
That warning is not a deploy blocker because the project and GitHub Actions are pinned to Node
`24.17.0`. Slice 13.6 must run the real install and validation under the pinned project runtime.

After the probe, `git diff -- package.json package-lock.json` in the real frontend repo was clean.

## Risk Assessment

| Risk | Decision | Slice 13.6 handling |
| --- | --- | --- |
| Low `astro` / `esbuild` audit residual | Upgrade path is acceptable only through controlled Astro 7 implementation | Use explicit package targets; do not run `npm audit fix --force` |
| Vite 8 / Rolldown output changes | Accepted implementation risk | Inspect build output, chunk warnings, generated assets, and source-map upload logs |
| Strict Astro compiler | Accepted implementation risk | Run `npm run check` and `npm run build`; fix only concrete invalid markup found by Astro 7 |
| TypeScript template checking | Accepted implementation risk | Upgrade to `typescript@5.9.3` rather than jumping to TypeScript 6 in this slice |
| Sentry sourcemap behavior | Must be proven before deploy | Keep current Sentry package versions unless validation proves a compatibility issue; inspect upload logs |
| CSP inline script hashes | Deployment gate | Compare generated inline scripts against the current Nginx CSP hash allowlist before push |
| Chat Widget iframe protocol | Must not change | Browser smoke must verify homepage widget open/ready and `/deepseek_chat/` hydration |
| Docs Markdown rendering | Must not regress | Browser smoke and manual QA must cover `/docs/`, code highlighting, Mermaid, and language switching |

## Slice 13.6 Implementation Scope

Smallest approved package target set:

```bash
npm install astro@7.0.6 @astrojs/react@6.0.1 typescript@5.9.3
```

Expected direct file impact:

- `package.json`
- `package-lock.json`
- public docs only if the implemented package graph, validation notes, or residual risk changes
- local roadmap

Expected indirect lockfile movement:

- `vite` resolves to the Vite 8 line.
- Astro's `esbuild` path resolves to the patched `0.28.x` line.
- TypeScript moves to `5.9.3`.
- `@sentry/astro` and `@sentry/react` stay on `10.58.0` unless the implementation finds a concrete
  Astro 7 compatibility issue.

Do not include unrelated package updates, source rewrites, Chat Guide changes, Chat Widget protocol
changes, telemetry transport, backend changes, Nginx config changes, or runtime pin changes in the
initial implementation.

If local Astro 7 build output requires CSP hash changes, stop before pushing the frontend deploy and
split or explicitly scope the Nginx CSP alignment. Do not deploy an Astro 7 static build that current
production CSP would block.

## Validation Plan

Slice 13.6 should run:

```bash
git diff --check
npm run sync
npm run lint
npm run typecheck
npm run check
npm run test:coverage
npm run build
npm run smoke:browser
npm audit --omit=dev --audit-level=low
npm audit --audit-level=low
pre-commit run --all-files
```

Focused review areas:

- `npm ci` behavior under Node `24.17.0` / npm `11.x`.
- `npm run check` output for stricter Astro compiler diagnostics.
- `npm run build` output for Vite 8/Rolldown warnings and chunk differences.
- Sentry source-map upload log lines during local build where credentials are available and in
  GitHub Actions deploy.
- Production `dist` sourcemap cleanup remains intact.
- Current CSP hash allowlist still covers generated inline scripts, or the implementation stops
  before deploy and scopes CSP alignment.
- Browser smoke and manual QA for `/`, `/docs/`, `/deepseek_chat/`, `/certifications/`, homepage
  Chat Widget open/ready, language switch, theme switch, and docs Mermaid/code highlighting.

## Deployment And Rollback Plan

Frontend deployment:

- Commit frontend dependency/docs changes with an implementation-scoped message.
- Push `master` only after all validation passes.
- Wait for `deploy.yml` success.
- Inspect deploy logs for Node/npm versions, Vite/Rolldown warnings, Sentry source-map upload,
  sourcemap deletion, CDN purge, and accepted residual log noise.
- Run read-only production checks:

```bash
curl -I https://www.rendazhang.com/
curl -I https://www.rendazhang.com/docs/
curl -I https://www.rendazhang.com/deepseek_chat/
curl -I https://www.rendazhang.com/certifications/
curl -i https://www.rendazhang.com/cloudchat/auth/healthz
```

Rollback:

- If validation fails before push, revert only the Slice 13.6 dependency/doc changes.
- If deploy fails, fix forward only when the issue is narrow and understood; otherwise revert the
  frontend Astro 7 commit and push the revert.
- If production smoke fails after a successful deploy, revert the frontend commit and redeploy the
  last known good Astro 6 build.
- If CSP mismatch is discovered before push, do not push the frontend build until CSP alignment is
  explicitly scoped and approved.

## Recheck Triggers

Re-run this precheck or open a new precheck before implementation if any of these change:

- Astro publishes a new major/minor that supersedes `7.0.6` as the relevant upgrade target.
- Vite changes the current Vite 8 migration guidance or minimum Node version.
- `@astrojs/react`, `@sentry/astro`, or Sentry source-map guidance changes the compatibility picture.
- npm audit or Dependabot changes severity, package path, or available remediation.
- The frontend runtime pin, deploy workflow, Chat Widget iframe protocol, or Nginx CSP policy changes
  before Slice 13.6 starts.

## Sources

- [Astro Upgrade to v7](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Vite Migration Guide](https://vite.dev/guide/migration)
- [Sentry Astro Source Maps](https://docs.sentry.io/platforms/javascript/guides/astro/sourcemaps/)
- [npm package: astro](https://www.npmjs.com/package/astro)
- [npm package: @astrojs/react](https://www.npmjs.com/package/@astrojs/react)
- [npm package: vite](https://www.npmjs.com/package/vite)
- [npm package: esbuild](https://www.npmjs.com/package/esbuild)
- [npm package: @sentry/astro](https://www.npmjs.com/package/@sentry/astro)
