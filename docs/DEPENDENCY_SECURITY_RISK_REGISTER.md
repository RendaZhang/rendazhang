<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Dependency Security Risk Register](#dependency-security-risk-register)
  - [October 2026 Astro And Sharp Patch](#october-2026-astro-and-sharp-patch)
    - [Target Advisories And Exposure](#target-advisories-and-exposure)
    - [Complete Lockfile Closure](#complete-lockfile-closure)
    - [ohash Exception And Font Boundary](#ohash-exception-and-font-boundary)
    - [Validation And Open Decisions](#validation-and-open-decisions)
  - [Historical August Evidence](#historical-august-evidence)
  - [Slice 15.1 Security Patch Result](#slice-151-security-patch-result)
  - [Slice 15.6.2 Rendering Security Patch Result](#slice-1562-rendering-security-patch-result)
  - [Active Risk Register](#active-risk-register)
  - [Escalation Thresholds](#escalation-thresholds)
  - [Maintenance Cadence](#maintenance-cadence)
  - [Owner Action Rules](#owner-action-rules)
  - [Astro 7 Precheck And Implementation Result](#astro-7-precheck-and-implementation-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Dependency Security Risk Register

- **Author**: Renda Zhang
- **Last Updated**: October 06, 2026 (UTC+08:00)
- **Scope**: public-safe dependency and security risk decisions for the PersonalWeb frontend.

This register records the current audit evidence, accepted residuals, escalation thresholds, and
owner actions after the controlled Astro 7 implementation, the Slice 15.1 production dependency
security patch, and the Slice 15.6.2 rendering dependency patch. It is intentionally public-safe:
it records package and validation decisions without changing CI workflows, runtime pins, frontend
behavior, backend behavior, Nginx configuration, telemetry, analytics, cookies, or production
services.

Do not add secrets, private advisory notes, credentials, private logs, private IP allowlists, or
server-only operational details to this document.

## October 2026 Astro And Sharp Patch

Slice 19.2.1 starts from source `ae3b8c7a41bd78a8b58d98929435b742ed8966ef`.
Evidence refreshed on October 06, 2026 uses Node `24.17.0` and npm `11.13.0`,
with that Node binary also first on the script-child `PATH`. The August zero-audit
results below are historical snapshots, not the current security baseline.

| Evidence | Before patch | Installed candidate | Meaning |
| --- | --- | --- | --- |
| Production npm audit | 14 package entries: 1 critical, 9 high, 1 moderate, 3 low; 26 distinct GHSA IDs | 12 entries: 0 critical, 8 high, 1 moderate, 3 low; 23 GHSA IDs | Three target advisories removed; other findings remain open |
| Full npm audit | 35 package entries: 1 critical, 23 high, 8 moderate, 3 low; 38 distinct GHSA IDs | 33 entries: 0 critical, 22 high, 8 moderate, 3 low; 35 GHSA IDs | Not a zero-audit pass or risk waiver |
| Dependabot at source baseline | 21 alerts, 20 GHSA IDs | Hosted refresh is separate from npm evidence | Alert, package and advisory counts overlap and must not be added |

Both audit commands return exit 1 because known findings remain. No new advisory
ID appeared in the installed candidate relative to the reviewed baseline.

### Target Advisories And Exposure

- [Astro AVIF image optimization](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2):
  `astro@7.1.6` moves to `7.2.8`, which requires the fixed Sharp line.
- [Astro base-path authorization](https://github.com/withastro/astro/security/advisories/GHSA-376h-93r7-7g6f):
  fixed in `7.2.4`, also covered by `7.2.8`. This site has no non-root Astro base
  or Astro authorization middleware; the public site is static output.
- [Sharp/libheif](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c):
  `sharp@0.35.3` moves to `0.35.4`, with prebuilt libvips packages `1.3.3` and
  libheif `1.23.2`. Image tooling processes repository/operator inputs, not a
  public image-upload endpoint. Static hosting does not exempt build-time native
  parsers from hostile input risk. No exploit fixtures or production failure
  probes are used.

### Complete Lockfile Closure

Only the direct Astro and Sharp caret declarations change. The 77 changed
package-node paths are grouped below, including removals and layout-only changes.
No direct dependency or override was added to force a transitive resolution.

| Nodes | Movement and reason |
| --- | --- |
| `astro`, `sharp` | `7.1.6 -> 7.2.8`, `0.35.3 -> 0.35.4`; reviewed security targets |
| `@astrojs/compiler-rs`, `compiler-binding` and bindings | `0.3.2 -> 0.4.1`; Astro requires `^0.4.0`. Darwin arm64/x64, Linux arm64/x64 GNU/musl, WASM, Windows arm64/x64 follow the binding; Android arm64 is newly required optional metadata |
| Astro-owned `@astrojs/internal-helpers` | Two nested copies `0.10.2 -> 0.10.4`; shared root `0.10.1` stays unchanged |
| `@astrojs/markdown-satteri`, `satteri` and `@bruits/satteri-*` | `0.3.5 -> 0.3.8`, requiring `satteri ^0.10.3`, resolved `0.9.5 -> 0.10.5`; Darwin arm64/x64, Linux arm64/x64 GNU/musl, WASM and Windows arm64/x64 follow the same version |
| `@types/hast` | `3.0.4 -> 3.0.5`, required by Satteri; other consumers accept the same 3.x node |
| `diff`, `find-proc` | `8.0.4 -> 9.0.0` and new `0.1.0`, explicitly required by Astro; no app-level imports added |
| `unifont`, `undici` | `0.7.4 -> 0.7.5`; new Undici `8.11.2` satisfies Unifont's `^8.0.0` proxy-aware fetch dependency. Its Node `>=22.19.0` engine fits the unchanged pin |
| `ohash` | `2.0.11 -> 2.0.12`, a separately reviewed in-range exception under Unifont, not a security fix; details below |
| `@napi-rs/wasm-runtime` | `1.2.2 -> 1.2.5`; compiler WASM now requires `^1.2.4`, Satteri `^1.2.3`; existing Rolldown accepts `^1.1.6`. The compatible v1 EMNAPI peer range remains valid |
| `@emnapi/core`, `@emnapi/runtime` | Root `1.11.2 -> 1.11.1`, with four redundant nested `1.11.1` copies removed under Satteri/Rolldown WASM. This hoists their existing exact requirements, satisfying the WASM runtime peer ranges; it is not a new downgraded Satteri/Rolldown binary. Sharp WASM gets a separate `@emnapi/runtime@1.11.3` required by its `^1.11.3` edge |
| `@img/sharp-*` | All native binaries `0.35.3 -> 0.35.4`: Darwin arm64/x64; Linux arm/arm64/ppc64/riscv64/s390x/x64 and musl arm64/x64; Windows arm64/ia32/x64; WASM, FreeBSD-WASM and WebContainers-WASM |
| `@img/sharp-libvips-*` | `1.3.2 -> 1.3.3`: Darwin arm64/x64; Linux arm/arm64/ppc64/riscv64/s390x/x64 and musl arm64/x64 |
| Removed unused nodes | Astro dropped `@rollup/pluginutils@5.4.0` and its nested `estree-walker@2.0.2`. The new Satteri tree no longer needs `hast-util-from-html@2.0.3`, `hast-util-from-parse5@8.0.3`, `hast-util-parse-selector@4.0.0`, `hastscript@9.0.1`, `vfile-location@5.0.3`, or `web-namespaces@2.0.1` |
| Classification only | `entities@6.0.1` and `parse5@7.3.0` become dev-only after the old Satteri production edge disappears; versions do not change |

Upstream review includes the [compiler 0.4.1 fixes](https://github.com/withastro/compiler-rs/releases/tag/%40astrojs%2Fcompiler-rs%400.4.1)
for whitespace, quoted-prop escapes and CSS selectors, and the
[Satteri 0.10.5 release](https://github.com/bruits/satteri/releases/tag/satteri-v0.10.5)
following its 0.10.3 footnote-prefix support. The required range excludes old Satteri.
[Unifont 0.7.5](https://github.com/unjs/unifont/releases/tag/v0.7.5) changes provider
fallback/stretch handling and proxy-aware fetching; [Undici 8.11.2](https://github.com/nodejs/undici/releases/tag/v8.11.2)
fixes aborted-request reconnect and rejected HTTP/2 WebSocket cleanup. These are
build/font paths, not additions to public Chat transport.

The incidental WASM runtime patch was reviewed against its
[upstream changes](https://github.com/napi-rs/napi-rs/compare/7e3f293e2d6a3032eabfe51ff38bcaa82d342a2f...023a9f067af5d44c9a06c9a30b48fdd50ab18ac0):
browser `node:url` shimming and packaging/tests changed; no EMNAPI 2 prerelease is
selected. Native macOS/Linux builds are the deployment gates, not a claim that
every optional WASM, Android or Windows binary was executed.

React, Vite, Sentry, PostCSS, DOMPurify, Mermaid and dev-tool versions are unchanged.
The optional `@astrojs/markdown-remark` peer was not installed. Remaining YAML,
TOML, SVG, serialization and browser-rendering findings are deliberately not
silently bundled into this image patch.

### ohash Exception And Font Boundary

Both Unifont versions permit `ohash ^2.0.11`; `2.0.12` is an approved incidental
patch, not required to fix Astro or Sharp. Its [release](https://github.com/unjs/ohash/releases/tag/v2.0.12)
changes serialization, diff traversal and packaging. The
[locale-independent comparator](https://github.com/unjs/ohash/commit/1d9402e)
preserves printable ASCII collation but places non-ASCII keys after ASCII by code
unit. Some old non-ASCII-key hashes can change; cross-version cache identity is
not promised.

The application has no direct ohash import or Astro font-provider configuration.
Its CSS uses system-font stacks. Installed Unifont uses ohash for provider/options
cache namespaces and font deduplication, with versioned cache entries. Focused
offline tests cover equivalent option/key ordering, Unicode keys and family names,
cache reuse across provider instances, unchanged resolved font descriptors and
separation of distinct font families. This neither fetches remote fonts nor adds
font features. Browser checks still verify real text rendering and font requests.

### Validation And Open Decisions

The existing coverage command discovers `SharpNativeImages.test.ts` on both local
macOS and Linux CI before deployment. It reports actual native versions, decodes
and resizes tiny benign JPEG/WebP/AVIF images, checks output pixels/dimensions,
and rejects bounded non-image input. This is regression coverage, not fuzzing or
proof that every native-parser vulnerability is absent. No hero asset is regenerated.

Release gates include clean lockfile installation and a valid dependency tree,
sync/lint/typecheck/Astro check, focused and full tests, browser smoke, static build,
pre-commit, executable CSP hash comparison, and desktop/mobile images, navigation,
theme persistence, bilingual Docs diagrams, Credly and direct/embedded Chat readiness.
Local validation passed: 17 focused tests, 160 tests across 42 coverage files,
9 browser smoke tests, and an 11-page static build. Astro check reported no
errors, warnings or hints. Actual macOS x64 native evidence is Sharp `0.35.4`,
libvips `8.18.6` and libheif `1.23.2`; all four generated executable inline-script
hashes match the existing CSP allowlist. Desktop `1366x900` and mobile `390x844`
checks passed with no application console errors or horizontal overflow, system-font
rendering and no font downloads. Credly's own statistics request was cancelled on
navigation away; its badge content and iframe load were verified.
The exact master-push Linux run must pass native tests, build/Sentry upload, transfer
and CDN purge before production checks establish deployment acceptance.

Remaining production entries are `brace-expansion`, `browserslist`,
`baseline-browser-mapping`, `devalue`, `dompurify`, `http-cache-semantics`, `js-yaml`,
`smol-toml`, `source-map-js`, `svgo`, `katex` and inherited `mermaid`.
Full-audit-only chains also include HumanFS, Vitest/mocker/UI/coverage, braces and
its inherited tool entries, colord, fast-uri and postcss-selector-parser.
They remain unfinished maintenance batches, not accepted residuals. KaTeX's fixed
line is outside Mermaid's supported range; braces and http-cache-semantics need
further upstream/owner decisions. Do not downgrade Mermaid or label disputed
advisories fixed without evidence. New advisories, changed input exposure, native
bundle failures, font-cache regressions or changed executable CSP hashes reopen
the gate. No blind audit fix or force fix is permitted.

## Historical August Evidence

Read-only checks captured before Slice 15.1 reported seven production findings: five high, one
moderate, and one low. The affected production packages were `astro`, Sentry's transitive
`brace-expansion` path, `dompurify`, `js-yaml`, `postcss`, `sharp`, and `svgo`. Full audit also
reported dev-only `fast-uri` and additional dev-only `brace-expansion` instances.

Slice 15.1 reduced both audits to zero. Fresh checks on August 08, 2026 reopened the gate with three
findings: moderate DOMPurify and Mermaid advisories plus a high-severity `nanoid` advisory through
the existing `postcss@8.5.25` dependency path.

After the Slice 15.6.2 patch:

| Check | Result | Decision |
| --- | --- | --- |
| `npm audit --omit=dev --audit-level=low` | 0 findings | Local production audit is clear |
| `npm audit --audit-level=low` | 0 findings | Local full audit is clear, including dev-only advisory paths |
| Direct production targets | `astro@7.1.6`, `@sentry/astro@10.69.0`, `@sentry/react@10.69.0`, `dompurify@3.4.13`, `mermaid@11.16.1`, `sharp@0.35.3` | Explicit package targets; no blind audit fix |
| Direct build target | `postcss@8.5.25` | Explicit target for the direct build dependency |
| Reviewed rendering leaf | `postcss@8.5.25 -> nanoid@3.3.18` | Patched the high-severity transitive leaf without adding `nanoid` as a direct dependency or changing PostCSS |
| Earlier reviewed leaf updates | `@sentry/vite-plugin@5.4.0`, `@sentry/bundler-plugins@10.69.0`, `minimatch@10.2.6`, `brace-expansion@5.0.9` / `1.1.18`, `fast-uri@3.1.5`, `js-yaml@4.3.1`, `svgo@4.0.2` | Cleared the earlier production and full-audit advisory nodes without adding direct dependencies |
| Sharp compatibility | `sharp@0.35.3` with libvips packages `1.3.2` | Accepted as a deliberate major after Node 24 support and image/build validation |
| Runtime baseline | Node `>=24.17 <25`, npm `>=11 <12`; CI uses Node `24.17.0` | Keep pinned |

Current relevant package path:

```text
astro@7.1.6 -> vite@8.1.3 -> postcss@8.5.25
astro@7.1.6 -> js-yaml@4.3.1 / svgo@4.0.2 / sharp@0.35.3
@sentry/astro@10.69.0 -> @sentry/vite-plugin@5.4.0 -> @sentry/bundler-plugins@10.69.0 -> minimatch@10.2.6 -> brace-expansion@5.0.9
mermaid@11.16.1 -> dompurify@3.4.13 (deduplicated with the direct dependency)
postcss@8.5.25 -> nanoid@3.3.18
```

The prior low Astro/esbuild residual remains resolved by the controlled Slice 13.6 upgrade. The
earlier August 2026 production findings are resolved by Slice 15.1, and the August 08 rendering
findings are resolved by Slice 15.6.2. The force-fix command remains disallowed because future
`npm audit fix --force` output may again mix major framework, runtime, or unrelated dependency
changes into what should be a focused maintenance decision.

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

## Slice 15.6.2 Rendering Security Patch Result

Slice 15.6.2 used reviewed non-major targets and one existing transitive lockfile leaf. It did not
run `npm audit fix`, `npm audit fix --force`, or change Astro, Sentry, React, PostCSS, runtime pins,
backend behavior, Nginx configuration, or the Chat Widget protocol.

| Finding owner | Baseline | Patched resolution | Notes |
| --- | --- | --- | --- |
| DOMPurify detached-subtree XSS advisory | `dompurify@3.4.12` | `dompurify@3.4.13` | Direct dependency and Mermaid's compatible path deduplicate to the patched version |
| Mermaid rendering advisories | `mermaid@11.15.0` | `mermaid@11.16.1` | Same-major release covering configuration, CSS isolation, architecture, XY chart, and radar diagram fixes |
| Nano ID zero-size generator advisory | `postcss@8.5.25 -> nanoid@3.3.16` | `postcss@8.5.25 -> nanoid@3.3.18` | Existing `^3.3.16` transitive range resolves to a patched 3.x leaf; no direct `nanoid` declaration was added |

Validation for this rendering patch includes clean production and full audits, a deduplicated
DOMPurify/Mermaid tree, Markdown sanitization tests, valid and malformed Mermaid rendering tests,
the full frontend coverage and browser smoke suites, a production build, executable CSP hash review,
and desktop/mobile checks for docs diagrams plus direct and embedded Chat readiness.

## Active Risk Register

| Risk | Current decision | Reason | Revisit trigger |
| --- | --- | --- | --- |
| Earlier August 2026 production advisories | Resolved by Slice 15.1 | Explicit targets and reviewed lockfile leaf updates cleared the earlier production and full audits without `npm audit fix` or force-fix behavior | New audit finding, Dependabot alert, package path change, severity increase, or deploy/build regression |
| August 08 rendering advisories | Resolved by Slice 15.6.2 | Explicit DOMPurify/Mermaid targets plus the existing patched Nano ID leaf clear the production and full audits without a direct Nano ID or PostCSS change | New DOMPurify, Mermaid, Nano ID, Markdown rendering, or diagram isolation finding |
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
