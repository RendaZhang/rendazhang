<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Personal Theme Palettes](#personal-theme-palettes)
  - [Direction And Names](#direction-and-names)
  - [Six Semantic Sets](#six-semantic-sets)
    - [Shared Status Sets](#shared-status-sets)
    - [Role And Consumer Mapping](#role-and-consumer-mapping)
  - [Decoration And State Boundaries](#decoration-and-state-boundaries)
  - [Contrast Evidence](#contrast-evidence)
  - [Preview Method And Findings](#preview-method-and-findings)
  - [Preference Compatibility](#preference-compatibility)
  - [Implementation Packets](#implementation-packets)
    - [19.4 Default Family And Shared Roles](#194-default-family-and-shared-roles)
    - [19.5 Alternative Families](#195-alternative-families)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Personal Theme Palettes

- **Author**: Renda Zhang
- **Last updated**: 2026-10-07
- **Status**: Planned contract, not shipped UI. Slice 19.3 publishes documentation only.
- **Preview source**: `831f36c1e1dec1679d580268ee4ffa73d9bcad65`.

## Direction And Names

Keep the real portrait, content, typography, layout, routes and interaction behavior. Use neutral
reading surfaces with small, repeated action colors; do not wash every section in the brand hue.
These are visual names, not claims about the owner's personality, culture or motivations.

| Internal ID | Planned English name | Planned Chinese name | Delivery |
| --- | --- | --- | --- |
| `default` | Ink And Vermilion | 墨与朱 | Default family, Slice 19.4 |
| `aurora` | Silver And Cobalt | 银与钴蓝 | Slice 19.5 |
| `forest` | Graphite And Pine | 石墨与松绿 | Slice 19.5 |

Use these compact names for the swatches' localized accessible names and tooltips. Keep a separate
localized group name, `Theme color palette` / `主题调色板`, and `aria-pressed` selection state.
Do not put the full names into new wide buttons. Selected swatches need a shape/border cue as well
as color; keyboard focus must remain distinguishable from selection.

**Existing implementation:** purple/blue Default, Aurora and Forest palettes already exist, with
independent light/dark mode, store, provider, pre-paint initialization and compact swatches.
**Pending implementation:** none of the colors or names below ships with this document. In 19.4,
replace only Default's colors/name; keep old Aurora/Forest colors/names usable until 19.5 replaces
both. There must still be three choices, not six old/new choices or prematurely renamed options.

## Six Semantic Sets

All values are opaque sRGB hex unless explicitly stated. These are reproducible reference values,
not a requirement to replace every existing token name. Retain absolute white/black and raw neutral
scales; map semantic roles instead of inverting `--color-white` or `--color-gray-900` by mode.
If implementation adds OKLCH equivalents, preserve these sRGB results and remeasure the rendered
composites. A palette is not just one replaced brand variable.

Column abbreviations: Ink L/D, Cobalt L/D and Pine L/D mean light/dark variants.

| Role | Ink L | Ink D | Cobalt L | Cobalt D | Pine L | Pine D |
| --- | --- | --- | --- | --- | --- | --- |
| Canvas | #F8F8F6 | #181B1A | #F3F5F7 | #181B20 | #F4F6F3 | #18211E |
| Raised / navigation / input panel | #FFFFFF | #222725 | #FFFFFF | #232830 | #FFFFFF | #232E28 |
| Subtle / code / secondary action | #EDEFEC | #2D3430 | #E8EDF2 | #2E3540 | #E9EEE9 | #303C34 |
| Text / headings / secondary-action foreground | #202321 | #F2F4F1 | #20262E | #F1F4F8 | #212722 | #F0F4EF |
| Muted / placeholder / disabled foreground | #535C56 | #B0BBB3 | #525F6B | #B1BDCC | #536156 | #B1C0B4 |
| Decorative separator | #D0D6D1 | #46514B | #CCD4DD | #465364 | #CDD7CF | #4A594E |
| Essential control edge | #747E77 | #87968C | #727F8C | #8999AC | #748277 | #8C9F91 |
| Primary / link / focus | #B83C35 | #F08072 | #234BC7 | #8EABFF | #245A49 | #89B89C |
| Primary hover / link hover | #9E302A | #F59A8E | #193CA6 | #AEC2FF | #1C483A | #A4CAB3 |
| Primary pressed | #862820 | #E56E60 | #14318A | #7899F2 | #16392E | #75A88A |
| On primary, hover and pressed | #FFFFFF | #181B1A | #FFFFFF | #181B20 | #FFFFFF | #18211E |
| Secondary accent text | #2A6763 | #8AC5BE | #944426 | #E5A88A | #766016 | #E2C75B |
| Sparse accent decoration | #2A6763 | #8AC5BE | #B95A36 | #E5A88A | #E2C75B | #E2C75B |
| Hover surface | #FBF3F3 | #322E2B | #F2F4FC | #2C3241 | #F2F5F4 | #2B3931 |
| Selected surface | #F8ECEB | #3B322E | #E9EDF9 | #303849 | #E9EFED | #2F3F36 |
| Pressed neutral-control surface | #F5E4E3 | #3F3330 | #E0E6F7 | #323A4D | #E0E8E6 | #314138 |

Pine's yellow and Cobalt's light copper decoration are **not** normal text colors on a light
surface. Their darker accent-text partners are intentional. Disabled background is Subtle,
with Muted text at opacity 1; disabled state still needs semantics and no hover action.

Hover surfaces originate from `color-mix(in srgb, primary 6%, raised)` in light mode, 8% in dark.
Selected uses 10% / 12%; pressed neutral controls use 14% in both modes. The table records rounded
8-bit results. Text, muted text, links and focus must work on all six canvas/surface/state bases.
Do not use the filled-button pressed shade as small link text on every dark tinted surface:
pressed links retain the link foreground and underline instead.

### Shared Status Sets

These mode-specific values apply to **each** family, not just Ink. A status is never expressed
by hue alone. Preserve labels, icons, validation messages and ARIA state; Vermilion brand red
must not be mistaken for an error. Do not invent a new status interaction.

| Status | Light text / icon / essential border | Light background | Dark text / icon / essential border | Dark background |
| --- | --- | --- | --- | --- |
| Success | #23613F | #E6F2EA | #9BD4AC | #253D2E |
| Warning | #79550D | #FFF2CD | #EFD07D | #403720 |
| Error | #A32E35 | #FCEBEB | #FFAFB3 | #47282D |
| Information | #245696 | #E9F0FC | #A4C5FF | #283750 |

Status text on a normal surface uses the same status foreground. If a status becomes a filled
action, choose and test a dedicated on-color; do not reuse a background tint as an action fill.

### Role And Consumer Mapping

| Planned role | Existing alias / narrow addition | Consumers and rules |
| --- | --- | --- |
| Canvas | `--color-bg`, `--color-subtle-bg-alt` | Page and Chat scroll area; no brand wash |
| Raised | `--color-surface`, `--color-nav-bg`, `--overlay-surface` | Navigation, menus, composer panel, neutral Chat header |
| Text | `--color-text`, `--color-nav-text`, `--color-text-deep`, `--color-text-darker`, `--color-text-heading` | Body and headings; avoid unrelated blue/purple heading aliases |
| Muted | `--color-text-muted`, `--color-muted`, `--color-gray-medium` | Supporting text, loading labels and explicit `::placeholder` with opacity 1 |
| Primary | `--color-brand`, link aliases | Filled actions, links and small section markers |
| On primary | Add `--color-on-primary` | Buttons, hero primary, Chat launcher and user bubble; **dark pastel fills need dark ink**, not legacy absolute white |
| Hover / pressed action | Add `--color-primary-hover`, `--color-primary-active`; retain compatible brand aliases | Explicit colors, no brightness filter that silently changes measured contrast |
| Secondary action | Subtle + Text, hover Hover surface + Text | Neutral button and reset control; essential edge uses Control, not Decorative separator |
| Accent | `--color-accent` | Secondary accent text; separate decorative accent if needed, not a second page wash |
| Hover / selected | `--color-palette-surface`, `--color-palette-surface-strong` | Nav, swatches, source hints, presets; Text remains foreground |
| Borders | `--color-border-soft` / muted for separators; `--color-border-neutral` / light / palette-border for essential edges | Decorative separators are not the only way to identify a control |
| Focus | Add `--color-focus`; retain `--focus-ring` consumer API | 2px Raised separator then 3px solid Focus ring (`0 0 0 2px raised, 0 0 0 5px focus`) |
| Disabled | Add disabled foreground/background aliases | Muted on Subtle, no group opacity multiplication |
| Markdown / assistant | `--color-md-*`, `--md-*`, `--md-color-*` | Raised + Text, neutral headings, Primary links; assistant bubble Hover surface + Text |
| Code / tables / quote | Existing Markdown aliases | Subtle + Text code, Raised body rows, Subtle header/zebra rows, Hover surface quote with Accent edge; preserve code content |
| Diagram canvas | Component-local paper role `#FFFFFF` | Keep current Mermaid SVG's own light-theme colors; apply paper to SVG itself, not an inline code line box |
| Chat user / source hints | On-primary on Primary; Text on Hover surface | Never derive colors, labels or destinations from generated answers |

Resolve all three Markdown alias families, not only `--color-md-bg`; dark-mode overrides and
page-specific selectors can otherwise retain the old purple or low-contrast text. Keep syntax
highlighting semantics, safe Markdown and Mermaid loading/fallback unchanged. Highlight comment
text must meet the normal-text threshold on Subtle; add real highlighted-code checks in 19.4.

Mermaid is a deliberate, bounded paper island in all six sets. Current generated diagrams use
dark `#333333` labels/edges and light nodes; a transparent SVG on a dark page hides connectors.
Do not rewrite generated SVG, change parser/security options, or introduce a theme-render lifecycle
just to recolor diagrams. The preview sets only the SVG background to white. This is not a complete
diagram accessibility claim: semantic labels, edge visibility, zoom and both locales need their
existing rendering checks at implementation time.

## Decoration And State Boundaries

- Reading surfaces and navigation stay neutral. Flat primary actions replace multi-hue gradients;
  existing gradient aliases may temporarily resolve to a same-color two-stop gradient for legacy
  background consumers. No broad animated gradient, glow, halo or new decorative asset.
- Keep spacing, crop, radii, typography and motion tokens unchanged in previews. Low/medium/high
  shadows are respectively `0 1px 2px #0000000D`, `0 2px 6px #00000014`, and
  `0 4px 12px #0000001F`; shadows are not control edges or focus indicators.
- Hero preview uses the existing portrait and `#101413` at 62% over the entire image instead of
  colored radial/linear layers. Hero text is opaque white. The secondary hero action is white
  with `#202321` text, hover `#EDEFEC`; it does not depend on unknown image pixels. The scrim is
  functional contrast, not a replacement image. Do not brighten text by adding larger shadows.
- Hero keyboard focus uses a 2px `#101413` separator and 3px white outer ring. Other controls use
  the Raised separator + Focus ring. Do not rely on a 20%-40% translucent brand glow.
- Palette swatches use the three light primary colors in both modes, with a white inset selected
  ring. Light/dark mode swatches retain their sun/moon symbols. Preserve existing hit sizes,
  Escape/focus-return behavior and selected semantics; no new selector state machine.
- Links remain underlined where they appear in prose. Hover uses a measured foreground, active
  retains the link color with underline. Selected/hover tint is not the only state cue.
- Keep existing reduced-motion rules. Loading retains text/ARIA feedback; neither a shimmering
  tint nor animation is the sole indication of progress. Error text keeps its label/icon.

## Contrast Evidence

Normal text includes small UI labels, placeholders, links and hover text: **at least 4.5:1**.
Only qualifying large text may use 3:1 (24 CSS px regular or approximately 18.67px bold).
Essential non-text control/state indicators need 3:1 against adjacent colors; inactive controls
and purely decorative lines have exceptions, but this design still gives disabled text a readable
target. These rules supersede older shorthand grouping all UI text with icons at 3:1.
Sources: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html),
[non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html),
[use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).

The temporary calculation evaluated 53 pairs per set, 318 total. For each set: Text, Muted, Link,
Accent text, Focus and Control edge against Canvas/Raised/Subtle/Hover/Selected/Pressed; On-primary
against primary/hover/pressed; Text and hover-link against a 72% Hover-surface layer over Canvas
and Raised; four status foreground/background pairs as text and non-text; disabled text; hero.
All pass their respective thresholds. Reported ratios are rounded for display, not for pass/fail.
An additional 72 status-text pairs (four statuses on Canvas/Raised/Subtle, six sets) also pass 4.5:1.

| Measured minimum | Ink L | Ink D | Cobalt L | Cobalt D | Pine L | Pine D |
| --- | --- | --- | --- | --- | --- | --- |
| Normal-text pairs | 4.57 | 4.65 | 5.21 | 5.10 | 4.88 | 4.84 |
| Primary / hover / pressed on-color | 5.62 | 5.56 | 7.23 | 6.28 | 7.97 | 6.06 |
| Links across six bases | 4.57 | 4.65 | 5.80 | 5.10 | 6.40 | 4.84 |
| Essential non-text pairs | 3.42 | 3.92 | 3.28 | 3.90 | 3.24 | 3.85 |

Reproduction: convert sRGB channels to linear light using the WCAG transfer function, then
`L = .2126 R + .7152 G + .0722 B`; contrast is `(lighter + .05) / (darker + .05)`.
For these sRGB mixtures, first compose encoded channels as `alpha * foreground + (1-alpha) *
background`, then calculate luminance. Retain full precision when checking browser-computed
colors. For the table's opaque hex references, use their exact 8-bit channels.
The 72% layer is intentional: existing docs/proof links use a partially transparent hover fill.
Do not compare that layer to white when its actual ancestor is dark Raised.

Browser-computed settled Chat hover backgrounds matched the table in all six sets, with their
corresponding Text foregrounds and Primary borders. Focus-visible was true in all six mode-menu
checks, with two selected controls (one mode, one palette) and the expected solid ring colors.
The hero's worst-case white source pixel under the 62% scrim is also included, not only a dark
sample of the photograph. Brand swatch selection uses white against the light primary fills,
whose minimum contrast is the 5.62:1 light filled-action minimum.

The existing `scripts/contrast-check.mjs` checks only gray-900 against gray-50. Its pass is a
baseline signal, **not** evidence for these six sets, transparency, syntax tokens, focus visibility,
disabled behavior or WCAG conformance of the website. 19.4/19.5 must extend role/state and rendered
browser coverage, including real inputs, code blocks, forms, errors and overlays.

## Preview Method And Findings

On 2026-10-07, used the current source with Node 24.17.0/npm 11.13.0 and the existing development
server on loopback. In-app Browser control worked, but final inspection found a screenshot
crop/scale mismatch with the emulated viewport; its raw capture also failed. The authorized
fallback used the repository's existing Playwright in isolated contexts, checked screenshot pixel
dimensions against each requested viewport, and regenerated the acceptance captures. No package
install was needed. Temporary unlayered CSS changed only color/shadow-related
properties and aliases. Production CSS, content, source files and images were not edited.

| Evidence | Route / state | Viewport / locale |
| --- | --- | --- |
| Four baseline captures | Home, existing Default, light/dark | 1366x900 and 390x844, Chinese |
| Twelve comparable previews | Home, all three families, both modes | 1366x900 and 390x844, Chinese |
| Twelve secondary previews | Direct Chat, empty guide questions and composer, no send | Same two sizes, all six sets, Chinese |
| Interaction samples | Six desktop mode-menu focus/selection checks; mobile English menu/Chat; hovered presets | Both sizes; Chinese and supplemental English |
| Diagram samples | Docs, two diagrams in each locale, Pine dark paper-island check | 390x844, English and Chinese |

To reconstruct: set each documented `data-theme` / `data-palette` pair through the existing
controls; map the role table to the aliases above in a temporary stylesheet after page CSS.
Use the flat action/on-color rules, explicit placeholders, neutral Chat header, scrim, swatch
fills, selected ring and shadow rules described above. Give the docs SVG itself a white
background; an inline `code` background does not cover the SVG bounds. Wait for finite CSS
transitions and real image/enhancement readiness, then capture the stated viewport. Do not change
text, add content, regenerate assets or use the preview as proof of pre-paint behavior.

All 24 family/page/viewport previews rendered nonblank, retained the portrait and real controls,
and had no document-level horizontal overflow. Visual inspection covered both contact sheets and
full-size interaction samples. Neutral surfaces separated the families without a large color wash;
dark actions needed the explicit dark on-color; explicit placeholder colors and the diagram paper
island avoid inherited/default-browser contrast failures. Existing social logo asset colors remain
unchanged, even where they do not match the chosen brand. Do not recolor those assets in this work.

Console limitation: an independent, **unmodified** development homepage also emitted a React
hydration attribute warning for social SVG image width/height metadata after navigation. This was
not a palette or CSS failure and was not repaired here. The tab's retained log also appeared during
later Chat captures; do not misattribute it to Chat or claim a globally clean console. Initial
in-app checks and the separate Docs sample had no new warning. The isolated Playwright pass also
recorded an outdated-optimizer 504 for Astro's development-toolbar entrypoint and Sentry transport
network failures, including on unstyled baseline navigation. These diagnostics are not concealed
by an all-clean console claim; they did not prevent page, image, diagram or theme-control rendering.
Record the bounded development issues for implementation QA; if the hydration issue reproduces in
a production build, resolve its ownership before accepting a UI release. No preview asserts
production hydration or full accessibility.

## Preference Compatibility

- Retain `ThemeMode = light | dark`, `THEME_PALETTES`, `ThemePalette`, `preferred_theme` and
  `preferred_palette`. Saved `default`, `aurora` and `forest` values map to the families above only
  when their visuals ship. Missing/invalid palette remains `default`; no storage migration,
  second store, new enum, accent picker, cookie or telemetry field is needed.
- `src/scripts/base-layout-init.ts` and its existing external-script delivery path own pre-paint
  `data-theme` / `data-palette` / initial attributes. No inline script or CSP allowance is proposed.
  Preserve existing mode system-preference and invalid-value behavior, rather than silently changing
  it as part of a color rename. Preserve JSON and legacy-string preference reads.
- `src/stores/uiPreferencesStore.ts` remains the framework-neutral subscription/validation boundary;
  `useUiPreferences` reads it, and `ThemeProvider` synchronizes DOM and persistence. Preserve
  `preferencesReady` and existing storage fallback behavior. Labels belong in `navContent.ts`.
- A newly loaded same-origin Chat iframe reads the same stored preferences through its own
  initializer/provider. The current Widget protocol is readiness-only; source inspection does not
  establish live palette mirroring into an already open document. Test initial open and reopen
  coherence; do not claim that shared storage alone supplies a cross-document live subscription.
  Any new live synchronization requirement needs an explicit compatibility decision, not a hidden
  `postMessage` change. CSS injected into this preview tab did not style the iframe automatically.

## Implementation Packets

### 19.4 Default Family And Shared Roles

Candidate files: `src/styles/core/{tokens.css,theme-tokens.css,_gradients.css}` and their token
documentation; narrowly affected `components/{about.css,social-icons.css,chat_widget.css,
deepseek_chat.css,docs.css,github-markdown-light.css,markdown-dark-mode.css}` plus
`components/{button/button.css,navigation/navigation.css,form/form.css}`. Audit other role consumers
such as certifications/profile/error pages before declaring a global token replacement complete.
Only actual color-consumer corrections belong in the diff; these paths are not a refactor checklist.

Add on-primary, explicit hover/pressed, focus and disabled roles where required; neutralize
oversized palette decoration without changing layout. Update only Default's names in
`src/content/navContent.ts`. Keep Aurora/Forest working with their **existing** semantic
values; do not apply Ink dark on-color rules to their old dark fills. No store/provider/initializer
redesign is needed. If a behavior defect requires one, return it for separate scope review.

Use existing `scripts/contrast-check.mjs`, `src/__tests__/ThemeToggle.test.tsx`,
`uiPreferencesStore.test.ts`, `storage.test.ts` and `tests/smoke/browser-hydration.spec.ts` for focused
additions. Test both modes, legacy raw/JSON values, missing/invalid palette, blocked storage,
reload/pre-paint consistency, selected/focus states, same-origin Widget open/reopen, bilingual text,
Docs diagrams, highlighted code, actual status/error surfaces and Credly. Preserve Markdown
security tests and iframe readiness. Run normal static checks, full coverage, browser smoke/build,
CSP review and production QA for the real implementation, not just this temporary stylesheet.

### 19.5 Alternative Families

Fill the Aurora/Cobalt and Forest/Pine combination selectors with their complete role sets; then
rename those two swatches in the same release. Reuse the shared roles and component fixes from
19.4. Expand the same tests to all six combinations, desktop/mobile and both languages, including
persisted old IDs, hover/selected/error/disabled/focus, reduced motion, actual transparent layers,
navigation, Markdown/code/diagrams, direct/embedded Chat and third-party framing.

Update architecture/style/testing/ownership docs only for changed shipped facts. No content rewrite,
new layout, image work, dependency/runtime/workflow, analytics, backend or Nginx change is implied.
The four time-bounded dependency risks remain governed by the separate
[risk register](DEPENDENCY_SECURITY_RISK_REGISTER.md), with recheck by 2026-10-14; this theme contract
does not accept new risk, dismiss alerts or reopen completed dependency patches.
