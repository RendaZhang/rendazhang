<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Dependency Security Risk Register](#dependency-security-risk-register)
  - [October 2026 SVG Tooling Patch](#october-2026-svg-tooling-patch)
  - [October 2026 Build Queries And Target Data Patch](#october-2026-build-queries-and-target-data-patch)
  - [October 2026 Build Data And Source Map Patch](#october-2026-build-data-and-source-map-patch)
  - [October 2026 Browser Sanitizer Patch](#october-2026-browser-sanitizer-patch)
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

## October 2026 SVG Tooling Patch

Slice 19.2.3.3 starts from accepted source `5c01d2799764dad8fd36d86f935fe991ef4b9d87`.
October 06, 2026 evidence uses Node `24.17.0` and npm `11.13.0`, including script
children. A package-scoped `npm update svgo --package-lock-only` changes exactly
four existing nodes, with no additions, removals, hoisting or incidental patches.
The manifest, overrides, Astro `7.2.8`, runtime pins and all prior fixes stay fixed.

| Node | Locked movement | Consumer and required range |
| --- | --- | --- |
| `svgo` | `4.0.2 -> 4.1.0` | Astro's optional SVG optimizer, existing `^4.0.1` |
| `css-select` | `5.2.2 -> 6.0.0` | SVGO now requires `^6.0.0`; explicitly reviewed internal major |
| `css-what` | `6.2.2 -> 7.0.0` | SVGO and css-select share `^7.0.0`; explicitly reviewed internal major |
| `sax` | `1.6.0 -> 1.6.1` | SVGO now requires exactly `1.6.1` |

css-select's floors change to domhandler `^5.0.3`, domutils `^3.2.2` and
nth-check `^2.1.1`. Installed `5.0.3`, `3.2.2` and `2.1.1` already satisfy them.
boolbase `1.0.0`, nested dom-serializer `2.0.0` / entities `4.5.0`, domelementtype
`2.3.0`, commander `11.1.0`, css-tree `3.1.0`, csso `5.0.5`, picocolors `1.1.1`,
patched source-map-js `1.2.2` and unrelated root DOM libraries remain unchanged.

[SVGO 4.1.0](https://github.com/svg/svgo/releases/tag/v4.1.0) adapts its XAST
selector integration for [css-select 6](https://github.com/fb55/css-select/releases/tag/v6.0.0)
and [css-what 7](https://github.com/fb55/css-what/releases/tag/v7.0.0), and intentionally
rejects illegal XML numeric references through SAX. It fixes
[GHSA-4vpr-x523-8j87](https://github.com/svg/svgo/security/advisories/GHSA-4vpr-x523-8j87)
(active HTML inside foreignObject) and
[GHSA-w27v-7q3p-w38r](https://github.com/svg/svgo/security/advisories/GHSA-w27v-7q3p-w38r)
(prefixed anchors and control-obfuscated URL schemes) in opt-in `removeScripts`.

| Evidence at accepted source / installed patch | Before | After |
| --- | --- | --- |
| Production npm audit | 4 entries: 2 high, 2 low; 4 GHSA IDs | 3 entries: 1 high, 2 low; 2 IDs |
| Full npm audit | 25 entries: 16 high, 7 moderate, 2 low; 16 GHSA IDs | 24 entries: 15 high, 7 moderate, 2 low; 14 IDs |

Neither snapshot has critical findings. Baseline hosted Dependabot evidence is
14 alerts / 13 IDs, not an npm package count. Both target IDs disappear from both
installed audits. Every remaining vulnerability entry, path and ID matches the
baseline exactly; no new ID appears. Both audit exits remain 1 for unfinished work,
not a zero-audit pass, exploitability claim or risk waiver.

The site imports repository-owned SVG social logos. No visitor SVG upload or public
optimizer endpoint was found. `experimental.svgOptimizer` and `removeScripts` remain
unconfigured: the isolated tests do not enable them for the site. Before patching,
a small control-reference input was accepted and a prefixed, tab-obfuscated anchor
survived the opt-in plugin. The patched tests require controlled parser rejection
and removal respectively. This demonstrates library behavior, not a present public
exploit. **SVGO is an optimizer, not a complete sanitizer**, and does not replace
DOMPurify or the Markdown boundary; custom namespace semantics are not generalized.

Eight bounded Node tests use real Astro/SVGO resolution and wrapper output, a small
repository logo, valid viewBox/geometry/text, ESM/CommonJS selector entrypoints and
the XAST adapter through inlineStyles. Class/attribute, child/sibling, pseudo-class
and nonmatching cases preserve selection. Text and attribute invalid XML references
fail without partial success; valid Unicode boundaries survive. Isolated opt-in
plugin cases inspect structured XML for HTML event/srcdoc/URL removal, prefixed links,
executable data URLs and preservation of safe text, shapes, links and PNG data.
No fixture content executes or makes network requests. Each child has a five-second
hard deadline and an after-checks marker. Existing native/font, real Chromium
sanitizer, parser/map and query/data coverage remains unchanged.

Local clean install/tree, sync/lint/typecheck, 203-file Astro check, 46 focused tests,
196 tests across 45 coverage files, 13 Chromium smoke cases and the 11-page build
passed. All four executable inline hashes match the existing allowlist. Desktop
`1366x900` and mobile `390x844` checks passed for all five SVG social logos, navigation
icons/theme persistence, images/system fonts, Docs zh/en/zh `2/2/2`, Credly and
direct/embedded Chat readiness, without app console errors or horizontal overflow.
An initial extra local browser pass overlapped smoke's rebuild and saw a transient
404; its evidence was retained, then the complete pass succeeded after the build.
No assertion or application behavior was changed to bypass that check.

Release gates include the full existing local checks, unchanged executable CSP
hashes, exact-SHA Linux tests/build, Sentry map upload/deletion, transfer/CDN and
read-only desktop/mobile production checks including SVG logos/icons. Local browser
QA is not claimed as a CI browser job. HTTP-cache semantics, KaTeX/inherited Mermaid
and dev-tool findings remain queued. Magicast's inlined old map copy remains open;
external map-node audits do not close it. The mapping data-age warning observed in
the preceding CI run remains a separate freshness review, not a reason to update
data or suppress warnings here. New IDs, actual consumer incompatibility, unrelated
lock churn or a new executable CSP allowance stop acceptance for review.

## October 2026 Build Queries And Target Data Patch

Slice 19.2.3.2 starts from accepted source `e32da48cefb4dc67bf337fa52cacd6e35432c0de`.
October 06, 2026 evidence uses Node `24.17.0` and npm `11.13.0`, including child
processes. Package-name-scoped npm resolution changes exactly eight existing lock
nodes. The manifest, overrides, parent packages and all other nodes are unchanged.
One-command publication cutoffs select the reviewed query/data versions rather than
latest data; these are not committed settings, overrides or artificial direct pins.

| Locked node | Movement | Consumer / closure |
| --- | --- | --- |
| Root `brace-expansion` | `1.1.18 -> 1.1.21` | ESLint/config and React lint consumers via unchanged minimatch `3.1.5`, `^1.1.7` |
| `glob/node_modules/brace-expansion` | `5.0.9 -> 5.0.12` | Sentry bundler plugins via glob `13.0.6` and minimatch `10.2.6`, `^5.0.8` |
| `@typescript-eslint/typescript-estree/node_modules/brace-expansion` | `5.0.9 -> 5.0.12` | Existing estree `8.61.0` and minimatch `10.2.6`, `^5.0.8` |
| `browserslist` | `4.28.2 -> 4.28.7` | Babel helper-compilation-targets `7.29.7`, `^4.24.0`; five required children below |
| `baseline-browser-mapping` | `2.10.37 -> 2.11.0` | Browserslist now requires `^2.10.44`; no new dependencies |
| `caniuse-lite` | `1.0.30001799 -> 1.0.30001806` | Exact reviewed floor of new `^1.0.30001806` range |
| `electron-to-chromium` | `1.5.373 -> 1.5.393` | Exact reviewed floor of new `^1.5.393` range |
| `node-releases` | `2.0.47 -> 2.0.51` | Exact reviewed floor of new `^2.0.51` range; Node `>=18` fits the pin |

Balanced-match on both major lines, concat-map, update-browserslist-db `1.2.3`,
escalade and picocolors stay fixed. There are no added/removed/hoisted nodes or
incidental patches. Existing Astro/Sharp/ohash/DOMPurify and parser/map fixes remain.

The six target IDs removed from both installed audits are:

- brace-expansion: [GHSA-q2hr-2g5m-vwhr](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-q2hr-2g5m-vwhr),
  [GHSA-qhr7-859c-m2p7](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-qhr7-859c-m2p7),
  [GHSA-6j4f-fj2g-mc7p](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-6j4f-fj2g-mc7p).
  Fixes bound rewrite/depth work and remove recursive comma parsing.
- Browserslist: [GHSA-c83g-rgw3-j3cx](https://github.com/browserslist/browserslist/security/advisories/GHSA-c83g-rgw3-j3cx)
  and [GHSA-73wf-gq98-2v4g](https://github.com/browserslist/browserslist/security/advisories/GHSA-73wf-gq98-2v4g).
  [4.28.7](https://github.com/browserslist/browserslist/releases/tag/4.28.7) adds bounded
  query/parse caching and safer stats normalization.
- Mapping: [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv).
  [2.11.0](https://github.com/web-platform-dx/baseline-browser-mapping/releases/tag/v2.11.0)
  replaces invalid-option process exits with errors and refactors compressed data.

| Evidence at source baseline / installed patch | Before | After |
| --- | --- | --- |
| Production npm audit | 7 entries: 0 critical, 4 high, 1 moderate, 2 low; 10 GHSA IDs | 4 entries: 0 critical, 2 high, 0 moderate, 2 low; 4 IDs |
| Full npm audit | 28 entries: 0 critical, 18 high, 8 moderate, 2 low; 22 GHSA IDs | 25 entries: 0 critical, 16 high, 7 moderate, 2 low; 16 IDs |

Fresh baseline Dependabot evidence is 21 alerts / 19 distinct IDs, not an npm package
count. Both installed audits exit 1 for unfinished batches. Each remaining entry,
path and ID matches the baseline; no new ID appears. These are not zero-audit passes,
risk waivers or proof of a publicly exploitable input path. Earlier snapshots remain
historical evidence rather than being overwritten with current counts.

The inspected inputs are repository/tool patterns, build source-map selection and
Babel target configuration. No public visitor pattern/query or custom-stats API was
found. Future hostile build inputs still matter despite static hosting.
`BuildQueryCompatibility.test.ts` uses real consumer resolution for all three
minimatch paths, tiny finite glob selection/ignores, fixed Babel targets and normalized
Baseline output. Its bounded child fixture checks literal fallback with lowered brace
guards, malformed/prototype-shaped stats without prototype mutation, repeated queries,
and both mapping APIs continuing after caught invalid-option errors.

Source review confirms query and parse Maps each evict at 500 entries. A finite
501-query, five-second-isolated test verifies result-cache eviction by identity and
correctness, not memory pressure; parse-cache bounding is source-review evidence,
not a separately instrumented memory assertion. Invalid stats can still throw a
catchable TypeError; the test preserves that upstream behavior rather than weakening
validation or claiming every malformed record is normalized.

Before/after historical Chrome 120, Firefox 121, Safari 17 and Node 20 target results
are identical. Baseline 2023 minimum browser versions also remain identical; the
Chrome/Chrome Android 120 release date changes from December 7 to December 5, 2023.
The broader Browserslist Baseline result changes Android Chrome/Firefox from 149/151
to 150/152 and adds desktop Chrome/Edge 150 and Firefox 152. These are reviewed data
changes, not a site build-target configuration change. Tests avoid wall-clock defaults.

Existing native/font, real Chromium sanitizer and parser/map regression tests remain
in place. Local gates passed: clean install/tree, sync/lint/typecheck, 202-file Astro
check with no diagnostics, 11 new query tests (38 focused regressions in total),
188 tests across 44 coverage files, 13 Chromium smoke cases and an 11-page build.
All four executable inline hashes remain allowlisted. Desktop `1366x900` and mobile
`390x844` checks passed for navigation/theme persistence, images/system fonts,
Docs zh/en/zh `2/2/2`, Credly and direct/embedded Chat readiness, without app console
errors or horizontal overflow. Credly statistics requests aborted on navigation
away; the badge itself loaded and was inspected. Exact-SHA deployment acceptance requires Linux tests, Sentry source-map
upload/deletion, transfer/CDN success, unchanged executable CSP hashes and read-only
desktop/mobile production checks; local Playwright is not claimed as a CI job.

Production findings still include HTTP-cache semantics, KaTeX/inherited Mermaid and
SVGO; dev-only chains remain queued. Magicast's inlined source-map-js `1.2.1` is still
unresolved as described below: patching the external node does not replace that copy.
SVGO and dev-tool/Magicast work, plus KaTeX/braces/HTTP-cache decisions, need separate
scopes. New IDs, real consumer incompatibility or an additional executable CSP hash
stop this patch for review. No audit fix, Mermaid downgrade or broad update was used.

## October 2026 Build Data And Source Map Patch

Slice 19.2.3.1 starts from accepted source `3dcc8f1304aa25e7bfb70cc81da9d5ba5a7cd9af`.
Evidence refreshed on October 06, 2026 uses Node `24.17.0` and npm `11.13.0`,
including script children. Structured, package-name-scoped npm resolution changes
exactly four lockfile nodes; package.json, root declarations, overrides and all
other nodes remain unchanged. No direct package or override is added. A one-command
publication cutoff selects the reviewed devalue `5.9.3` rather than the newer
`5.9.4`; it is not a repository setting or a general dependency freeze.

| Node | Locked movement | Consumers and unchanged ranges |
| --- | --- | --- |
| `devalue` | `5.8.1 -> 5.9.3` | Astro `7.2.8` and React integration `6.0.1`, `^5.8.1`; no children |
| `js-yaml` | `4.3.1 -> 4.3.2` | Astro/helper `^4.3.0` or `^4.1.1`, ESLint/config tooling's compatible 4.x ranges; `argparse ^2.0.1` unchanged |
| `smol-toml` | `1.7.0 -> 1.9.0` | Astro/helpers `^1.6.0`; no children; Node `>=18` fits the pin |
| `source-map-js` | `1.2.1 -> 1.2.2` | PostCSS `8.5.25` and declared Magicast edge `^1.2.1`, CSS-tree `^1.0.1`; no children; vendored-copy limitation below |

[devalue 5.9.3](https://github.com/sveltejs/devalue/releases/tag/v5.9.3) includes
malformed-data validation, sparse/repeated-value handling, async rejection and
Buffer-view fixes. [js-yaml's advisory](https://github.com/nodeca/js-yaml/security/advisories/GHSA-2883-xcg3-v3hh)
requires empty merge sources to consume budget. [smol-toml 1.9.0](https://github.com/squirrelchat/smol-toml/releases/tag/v1.9.0)
rewrites parsing and returns null-prototype records: this is an explicitly tested
minor compatibility change, not a leaf patch assumed safe from semver alone.
Default legacy dates and namespace imports are retained; no Temporal or unsafe-key
policy is enabled. [source-map-js 1.2.2](https://github.com/7rulnik/source-map-js/releases/tag/v1.2.2)
validates indexed offsets, bounds nested offsets and avoids unbounded work past
generated code; it also removes a CSP-sensitive dynamic-function path.

The 11 named IDs removed from both installed npm audits are:

- devalue: `GHSA-9rgm-9g3h-6x36`, `GHSA-j22f-vq7h-c4qm`, `GHSA-hx4r-w6wj-j8fg`,
  `GHSA-mcm9-63f2-9j32`, `GHSA-wf3x-273g-mvxv`, `GHSA-x5rw-q4pp-hg5g`,
  `GHSA-4q55-j62x-fr9h`.
- js-yaml: `GHSA-2883-xcg3-v3hh`.
- smol-toml: `GHSA-7w5x-hrqm-74c2`, `GHSA-r4xh-jqrq-34v2`.
- source-map-js: `GHSA-68fv-2mgg-jv7q` (installed dependency node, not every vendored copy).

| Evidence | Accepted source baseline | Installed patch |
| --- | --- | --- |
| Production npm audit | 11 package entries: 0 critical, 8 high, 1 moderate, 2 low; 21 GHSA IDs | 7 entries: 0 critical, 4 high, 1 moderate, 2 low; 10 GHSA IDs |
| Full npm audit | 32 entries: 0 critical, 22 high, 8 moderate, 2 low; 33 GHSA IDs | 28 entries: 0 critical, 18 high, 8 moderate, 2 low; 22 GHSA IDs |

Both audit commands return exit 1 for known unfinished work, not an installation
failure or a zero-audit pass. Every remaining vulnerability entry, including its
paths and IDs, matches the baseline. No added ID appears; previous Astro, Sharp and
DOMPurify advisory IDs remain absent. Audit package entries are not hosted alert counts or
proof of exploitability. All earlier dated snapshots below remain historical evidence.

These consumers process build/developer content, frontmatter, config and maps.
The current static site exposes no Astro Actions, session or public parser endpoint.
React integration uses devalue `uneval` for options; Astro uses it for build data.
Static hosting does not remove build-input risk. Tests use real installed consumer
resolution and small offline inputs, not public requests, fuzzing or stress workloads.

`BuildDataCompatibility.test.ts` checks dates, Maps/Sets, escaped text, repeated
references, small sparse arrays, null-prototype records and Buffer view boundaries;
Astro YAML/TOML frontmatter with all four content modes; TOML own-property, spread,
JSON and legacy-date handling; real source-map round trips and PostCSS previous-map
consumption. The bounded fixture has a five-second child-process hard deadline and
strict unhandled-rejection handling for async devalue, YAML merge budgets, malformed
frontmatter and invalid indexed maps. No generated JavaScript is evaluated and no
prototype is mutated. Existing native-image and real Chromium sanitizer tests remain
unchanged. See [Testing](./TESTING.md) for the execution boundary.

Local gates passed: clean installation, valid installed tree, sync/lint/typecheck,
Astro check with no errors/warnings/hints, 14 focused tests, 177 tests across 43
coverage files, 13 Chromium smoke cases and an 11-page static build. All four
executable inline hashes match the existing CSP allowlist. Desktop `1366x900` and
mobile `390x844` checks passed for navigation/theme persistence, images/system fonts,
Docs zh/en/zh `2/2/2`, Credly and direct/embedded Chat readiness, with no application
console errors or horizontal overflow. Fixtures stay local. Deployment acceptance
still requires the exact source-SHA push run, Linux tests, Sentry source-map upload
and deletion, transfer/CDN completion and read-only production checks.

An audit blind spot remains: `magicast@0.5.3` declares the patched external edge but
also identifies an **inlined source-map-js 1.2.1** in its published package. Its
Recast code uses that internal copy for map composition. Updating the external node
does not rewrite the bundle. The inspected Vitest coverage consumer parses its local
config only for threshold auto-update, which this repository does not enable; it
supplies no input map. No application import or public-input path was found. This
is not a claim that the vendored copy is fixed or a risk waiver: review it with the
separate dev-tool batch, and reopen immediately if map input or that consumer changes.
No Magicast/Vitest upgrade is hidden in this patch.

Remaining production packages are `baseline-browser-mapping`, `brace-expansion`,
`browserslist`, `http-cache-semantics`, `katex`, inherited `mermaid` and `svgo`.
The known full-audit-only tooling chains also remain open. Build matching/target
data, SVG optimization and dev-tool patches require their own scopes; KaTeX,
braces and HTTP-cache decisions are not waived. New advisory IDs, consumer
incompatibility, expanded input reachability or a new executable CSP hash stop
acceptance for review. No broad update, Mermaid downgrade or audit fix was used.

## October 2026 Browser Sanitizer Patch

Slice 19.2.2 starts from accepted source `f5f32f0101450fbb13c8336b0cfd8237c92309b1`.
Evidence refreshed on October 06, 2026 uses Node `24.17.0` and npm `11.13.0`,
including script children. The only package-node change is `dompurify 3.4.13 -> 3.4.16`;
the direct caret declaration and lockfile root agree. Mermaid `11.16.1` accepts
`dompurify ^3.3.3` and deduplicates to the same patched instance. Its KaTeX `0.16.47`,
the existing optional `@types/trusted-types 2.0.7`, Astro `7.2.8`, Sharp `0.35.4`,
ohash `2.0.12`, runtime pins and all other package nodes remain unchanged.
No incidental dependency exception, override or Mermaid downgrade is used.

The [3.4.16 release](https://github.com/cure53/DOMPurify/releases/tag/3.4.16) fixes
[GHSA-p98j-92pf-mc4p](https://github.com/cure53/DOMPurify/security/advisories/GHSA-p98j-92pf-mc4p)
(IN_PLACE with node-removing afterSanitize hooks) and
[GHSA-6688-9rhm-gjv2](https://github.com/cure53/DOMPurify/security/advisories/GHSA-6688-9rhm-gjv2)
(a removed IN_PLACE raw-text root surviving serialization/reparse). The application
sanitizes the string returned by marked before assigning HTML; it neither uses
IN_PLACE nor registers removal hooks. This is a real browser trust boundary for
Chat/model text, but the advisory-specific exploit preconditions are not demonstrated
at the application call site. The release also adjusts module declarations and
upstream bundling, so import/type/build checks remain necessary.

| Evidence | Accepted source baseline | Installed patch | Decision |
| --- | --- | --- | --- |
| Production npm audit | 12 package entries: 0 critical, 8 high, 1 moderate, 3 low; 23 GHSA IDs | 11 entries: 0 critical, 8 high, 1 moderate, 2 low; 21 GHSA IDs | Only the two DOMPurify IDs removed |
| Full npm audit | 33 entries: 0 critical, 22 high, 8 moderate, 3 low; 35 GHSA IDs | 32 entries: 0 critical, 22 high, 8 moderate, 2 low; 33 GHSA IDs | No added advisory IDs; not a zero-audit pass |

Both installed audits return exit 1 for remaining known findings. Package entries,
unique advisory IDs and hosted Dependabot alert counts are different measurements.
All remaining advisory IDs match the accepted baseline; the earlier Astro/Sharp
targets remain absent. Historical August and earlier October evidence below is
preserved rather than rewritten as today's state.

Regression coverage uses real DOMPurify string/Markdown sanitization for scripts,
event attributes and encoded unsafe URLs while preserving text, code and safe links.
The loopback-only Chromium smoke tests intercept synthetic Chat responses and exercise
the actual bundled DOMPurify and Mermaid at desktop and mobile sizes. They inspect
the resulting DOM and a harmless execution marker, with an inline-handler positive
control so CSP blocking alone cannot produce a false pass. Real safe diagrams,
benign math labels and malformed-diagram fallback are checked. These same browser
cases also passed before the patch; they are compatibility/security-boundary regression
tests, not a reproduced IN_PLACE exploit or a KaTeX security fix. No fixture is sent
to production or a paid API. See [Testing](./TESTING.md) for the test boundary.

Release gates retain the complete frontend validation/build/hook sequence, current
executable CSP allowlist, Docs zh/en/zh diagrams, same-origin Widget readiness and
Credly framing. Browser smoke runs locally; the unchanged deployment workflow runs
the unit/coverage and build gates, not Playwright. Only the exact successful source-SHA
push run plus production checks establishes deployment acceptance.

Local gates passed with 18 focused tests, 163 tests across 42 coverage files, 13
Chromium smoke cases and an 11-page build. Astro check reported no errors, warnings
or hints; all four generated executable inline hashes match the existing allowlist.
Desktop `1366x900` and mobile `390x844` checks passed for Docs zh/en/zh `2/2/2`,
navigation/theme persistence, images/system fonts, Credly and direct/embedded Chat
readiness, with no application console errors or horizontal overflow. Credly's
statistics request was cancelled when navigating away; badge content was verified.

Remaining production packages are `baseline-browser-mapping`, `brace-expansion`,
`browserslist`, `devalue`, `http-cache-semantics`, `js-yaml`, `katex`, inherited
`mermaid`, `smol-toml`, `source-map-js` and `svgo`. Dev-only chains listed in the
earlier October section remain open. KaTeX's fixed line is outside the current
Mermaid range; braces and HTTP-cache findings still require separate decisions.
None is waived here. New advisory IDs, changed input reachability, sanitizer/diagram
regressions or a new executable CSP hash stop the patch for a separate decision.

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
