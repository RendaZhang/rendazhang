<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Human Voice And Personal Expression](#human-voice-and-personal-expression)
  - [Purpose](#purpose)
  - [Relationship To Existing Rules](#relationship-to-existing-rules)
  - [Intended Impression](#intended-impression)
  - [Visitor Language And Maintainer Language](#visitor-language-and-maintainer-language)
  - [Current Phrase Inventory](#current-phrase-inventory)
  - [Shared Editorial Contract](#shared-editorial-contract)
    - [Start With The Person Or The Answer](#start-with-the-person-or-the-answer)
    - [Be Specific Without Inventing](#be-specific-without-inventing)
    - [Control Density And Technical Terms](#control-density-and-technical-terms)
    - [Write Action Labels For Outcomes](#write-action-labels-for-outcomes)
    - [State Limits In A Human Way](#state-limits-in-a-human-way)
  - [English Editorial Principles](#english-editorial-principles)
  - [Chinese Editorial Principles](#chinese-editorial-principles)
  - [Bilingual Parity Rules](#bilingual-parity-rules)
  - [Factual Correction Versus Stylistic Rewrite](#factual-correction-versus-stylistic-rewrite)
  - [Surface-Specific Direction](#surface-specific-direction)
    - [Homepage](#homepage)
    - [PersonalWeb And `/docs/`](#personalweb-and-docs)
    - [Certifications](#certifications)
    - [Chat Guide](#chat-guide)
    - [README And Maintainer Docs](#readme-and-maintainer-docs)
  - [Interaction-Expression Contract](#interaction-expression-contract)
    - [Motion](#motion)
    - [Color](#color)
    - [Imagery](#imagery)
    - [Personal Character](#personal-character)
  - [Owner Input Required Before Broad Rewrites](#owner-input-required-before-broad-rewrites)
  - [Ownership And Phase 15 Handoff](#ownership-and-phase-15-handoff)
  - [Acceptance Checklist](#acceptance-checklist)
  - [Validation Expectations](#validation-expectations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Human Voice And Personal Expression

- **Last Updated**: August 01, 2026, 16:48 (UTC+08:00)
- **Scope**: Phase 15 bilingual editorial and interaction-expression contract for public
  PersonalWeb surfaces.
- **Audience**: maintainers, reviewers, and future agents writing or designing for PersonalWeb.

## Purpose

PersonalWeb should sound like Renda Zhang explaining his work, not like an internal roadmap, a
requirements document, or a generic portfolio template. This contract defines how future slices
should turn verified public facts into direct English and Chinese writing, and how visual or
interaction choices can add recognizable personal character without a broad redesign.

This document is a rule source for future work. It does not rewrite current pages, change Chat
Guide prompts, alter metadata, add UI behavior, or authorize new claims by itself.

## Relationship To Existing Rules

This contract supplements rather than replaces the existing boundaries:

- [Content And Credibility Positioning](./CONTENT_CREDIBILITY_POSITIONING.md) owns the audience,
  public positioning, evidence priorities, and factual credibility rules.
- [Portfolio Proof And Visitor Conversion](./PORTFOLIO_PROOF_VISITOR_CONVERSION.md) owns the current
  proof destinations and visitor paths.
- [Chat Guide Quality Architecture](./CHAT_GUIDE_QUALITY_ARCHITECTURE.md) and
  [Chat Guide Knowledge Boundary](./CHAT_GUIDE_KNOWLEDGE_BOUNDARY.md) own Chat grounding, refusal,
  source hints, privacy, and frontend/backend boundaries.
- [Frontend Architecture Conventions](./FRONTEND_ARCHITECTURE.md) and
  [Frontend Directory Ownership Map](./DIRECTORY_OWNERSHIP.md) own implementation placement.
- [Visual Interaction Polish](./VISUAL_INTERACTION_POLISH.md),
  [Interaction Component Standards](./INTERACTION_COMPONENT_STANDARDS.md), and
  [Style Guide](./STYLE_GUIDE.md) own tokens, accessibility, focus, motion, and component behavior.
- [SEO / GEO Maintenance](./SEO_GEO.md) owns synchronization of visible claims with metadata,
  structured data, `llms.txt`, and sitemap updates.

When rules appear to conflict, factual accuracy, privacy, accessibility, and source ownership take
priority over tone or visual personality.

## Intended Impression

The site serves recruiters, collaborators, technical peers, search/AI summarizers, and casual
visitors. Across those audiences, it should feel:

- personally authored, direct, and calm;
- technically specific without reading like a dependency inventory;
- confident about verified work and explicit about real limits;
- bilingual by intent, not mechanically translated word for word;
- professional and creative without marketing exaggeration;
- useful on the first scan, with deeper detail available for readers who want it.

The voice is not casual for its own sake. Personality should come from clear choices, concrete
examples, and first-person ownership.

## Visitor Language And Maintainer Language

Public-safe language is not automatically visitor-ready language. Maintainer docs may use terms
such as `proof surface`, `source-bounded`, `runtime pin`, or `iframe protocol` when those terms are
technically precise. Visitor-facing headings, summaries, CTA labels, helper text, chips, and source
hints should translate internal concepts into the question answered or action offered.

Use this test:

> Would a visitor say this phrase while deciding what to learn or do next?

If not, keep it in maintainer documentation or translate it before placing it on a visible page.

Technical nouns such as Astro, React, Java, Spring, Kubernetes, CSP, CI/CD, and AWS are not banned.
Use them when they explain a real implementation or decision. Do not stack them only to signal
technical sophistication.

## Current Phrase Inventory

The following inventory records rewrite direction for later slices. Examples are directional, not
approved final page copy.

| Current phrase or pattern | Current surface | Decision | Later rewrite direction |
| --- | --- | --- | --- |
| `Proof path` / `证明路径` | Homepage eyebrow and CTA | Rewrite on visitor surfaces; keep in planning docs | Describe the visitor choice, such as exploring the project, certification, Chat, or contact |
| `Choose the evidence that matches your question` | Homepage section title | Rewrite | Lead with what the visitor can learn, not the information architecture |
| `proof surface` / `证明面` | Homepage note, `/docs/`, Chat fallback, README | Keep only in maintainer docs; rewrite in visitor copy and README introductions | Use `project overview`, `case study`, `how I built PersonalWeb`, or natural Chinese equivalents |
| `scan-friendly project proof surface` | Homepage action note | Rewrite | Say what appears after the click, for example a concise project overview |
| `Main proof`, `Credential proof`, `Guided proof` | Homepage intent labels | Rewrite or remove | Use short content labels such as `Project`, `Certification`, or `Ask about the site` only if the labels add information |
| `Contact intent` / `联系意向` | Homepage action | Rewrite | Use the direct action `Contact me` / `联系我` |
| `AWS certification context` / `AWS 证书上下文` | Homepage and docs links | Rewrite | Explain what the certification adds or what it covers |
| `Architecture credibility signal` / `架构可信度信号` | Certifications heading | Rewrite | Use `What this certification shows` / `这项认证能说明什么` |
| `evidence chain` / `证据链` | Certifications, `/docs/`, README | Usually rewrite on visitor surfaces; keep in strategy docs | Name the supporting items directly: project, certification, experience, and documentation |
| `source-bounded prompt path` | `/docs/` case study | Keep in technical docs; translate in visitor summary | Say that guided answers use public information from this site |
| `public proof question` / `公开证明问题` | Chat preset heading | Rewrite in Chat UX slice | Invite visitors to ask about Renda's work or PersonalWeb |
| `public-source preset questions` | Homepage Chat note | Rewrite | Say that the guide answers from public site information |
| Repeated `not proof of...` paragraphs | Homepage, `/docs/`, certifications, Chat | Keep the rule, compress the display | Place one concise limitation next to the relevant claim instead of repeating legalistic disclaimers |
| `PersonalWeb Proof` / `PersonalWeb 证明` | Hero taglines and README headings | Defer to homepage/docs slices | Prefer a phrase that names the project or Renda's role in building it; retain `proof` only where it remains natural in context |
| Dense capability lists and percentage scores | Homepage skills | Defer to Slice 15.4 | Group around work Renda does and decisions he makes; do not imply measured proficiency without a defined measurement |
| Mixed Chinese with `surface`, `credential`, `source-bounded`, `ownership`, `pin`, or `runbook` | Homepage, `/docs/`, certifications, public README | Translate on visitor surfaces; keep standard terms in technical docs when useful | Use natural Chinese first, with the English technical term only when readers need it |

## Shared Editorial Contract

### Start With The Person Or The Answer

- Use `I` / `我` when Renda owns a decision, built something, learned something, or is inviting a
  visitor to act.
- Use third person for metadata, credential records, formal biography facts, or text that must be
  reusable outside Renda's voice.
- Start a section with the conclusion a visitor needs. Put frameworks, protocols, and validation
  mechanics after that conclusion.
- Prefer one useful idea per sentence. Split sentences that combine positioning, architecture,
  validation, limitations, and CTA intent.
- Do not narrate site mechanics to visitors with phrases such as `the homepage now points to` or
  `this surface routes visitors`. State the useful content directly.

### Be Specific Without Inventing

- Every role, date, credential, metric, employer, technology claim, and project outcome must map to
  visible site content or intentionally public repository documentation.
- A concrete decision or lesson is stronger than a broad adjective. Use verified examples of what
  Renda built, changed, tested, or maintained.
- Do not infer private employer architecture, customer details, production traffic, cloud-account
  access, performance outcomes, or personal motivations.
- Keep approximate metrics explicitly approximate. Do not turn a public estimate into an exact
  result during a stylistic rewrite.
- If a stronger sentence needs a missing fact, add it to the owner-question list instead of filling
  the gap with generic language.

### Control Density And Technical Terms

- Headlines should carry one idea. Supporting copy may add the evidence or consequence.
- A short summary should normally use one or two sentences. A list should earn its place by helping
  comparison, not by displaying every available tool.
- Use a technical term when it identifies a real system, constraint, or decision. Explain its
  significance in ordinary language on the same surface.
- Avoid chains of abstract nouns such as `architecture credibility signal`, `visitor proof path`,
  or `delivery discipline boundary`.
- Avoid clusters of slash-separated terms unless the combined form is standard, such as CI/CD or
  OAuth/OIDC in technical detail.
- Keep repeated privacy and scale caveats short. One accurate boundary is more credible than several
  defensive variations.

### Write Action Labels For Outcomes

- CTA labels should use a direct verb plus a concrete destination or outcome: read, view, ask,
  verify, download, or contact.
- Do not use internal funnel labels such as `intent`, `path`, `surface`, or `proof` when a clearer
  destination exists.
- The link label and destination must agree. A link to `/docs/` can promise a project overview or
  technical details; it should not promise private production evidence.
- Paired English and Chinese CTA labels must express the same action even when their wording is not
  literal translation.
- Helper copy should add information that the button label cannot carry. Do not restate the label
  in a longer sentence.

### State Limits In A Human Way

- Use a limitation only where a reasonable visitor could otherwise overread the claim.
- State what the public material does show before stating what it does not show.
- Prefer a concise sentence such as `The certification supports my architecture foundation; it does
  not by itself show production ownership at scale.`
- In Chinese, prefer direct natural wording such as `这项认证说明我的架构基础，但不能单独证明大型
  生产环境经验。`
- Keep detailed privacy, refusal, prompt-injection, and operational exclusions in the existing
  boundary documents. Do not copy the full list into normal page prose.

## English Editorial Principles

- Write in plain first-person English where Renda is speaking. Prefer `I built`, `I use`, `I
  learned`, or `I focus on` over `this surface demonstrates`.
- Prefer concrete verbs over capability nouns: `designed`, `shipped`, `tested`, `documented`, and
  `maintained` are stronger than `delivery discipline` or `engineering credibility`.
- Avoid portfolio cliches such as `passionate`, `results-driven`, `cutting-edge`, `world-class`,
  `seamless`, or `innovative` unless a sentence supplies specific evidence and the word remains
  necessary.
- Avoid impersonal transitions such as `the visitor can then branch into`. Address the visitor
  directly or name the available destination.
- Keep contractions natural in conversational sections, but use formal wording for credential
  records, privacy boundaries, and API/protocol documentation.
- Preserve proper names and established technical terms. Explain why they matter rather than
  expanding every acronym mechanically.

## Chinese Editorial Principles

- Use natural Chinese sentence order. Do not translate English noun stacks directly into phrases
  such as `架构可信度信号` or `访问者证明路径`.
- Use `我` for authored experience and decisions. Avoid repeated `本网站`、`该项目`、`此证明面`
  when `我`、`PersonalWeb` or the concrete feature is clearer.
- Prefer Chinese verbs such as `设计`、`搭建`、`交付`、`维护`、`验证`、`取舍` over strings of
  imported abstract nouns.
- Keep standard technical names such as Astro, React, Java/Spring, Kubernetes, CI/CD, CSP, and
  Chat Widget where they aid recognition. Translate surrounding explanation instead of mixing
  unnecessary English words into every sentence.
- Avoid official-sounding or generated phrases such as `赋能`、`沉淀能力`、`打造闭环`、`多维度
  证明`、`全面提升` unless a concrete action makes the phrase necessary.
- Chinese copy may be warmer and more compact than English copy. It must still preserve the same
  dates, roles, limits, destination, and strength of claim.

## Bilingual Parity Rules

English and Chinese are parallel authored versions, not a source and its literal translation.
Before shipping visible bilingual copy, compare the two versions for:

- the same factual claim, role, date, employer, credential, and metric;
- the same degree of certainty and the same limitation;
- the same CTA destination and user intent;
- similar information priority, even if sentence order differs;
- natural terminology for each audience;
- no extra claim appearing in only one language.

If one language cannot express a technical term naturally, keep the recognized English product or
protocol name and explain it in that language. Do not add a new fact merely to make both versions
the same length.

## Factual Correction Versus Stylistic Rewrite

Treat these as different change classes:

| Change class | Examples | Required handling |
| --- | --- | --- |
| Factual correction | Current role, date, certificate validity, broken destination, incorrect localized URL | Verify against an existing public source, correct all owned public surfaces, and update tests/metadata only where the fact is duplicated |
| Stylistic rewrite | First-person voice, shorter sentence, natural Chinese, clearer CTA, less internal jargon | Preserve every fact and destination; review bilingual intent and evidence strength; do not broaden the claim |
| New public claim | Motivation, lesson, outcome, metric, preference, anecdote, current responsibility not already public | Require owner confirmation before drafting it as fact |
| Interaction expression | Portrait crop, motion, color emphasis, navigation treatment, disclosure behavior | Follow the visual, token, accessibility, reduced-motion, and browser QA documents; do not treat visual emphasis as evidence |

A slice may include both factual and stylistic work only when their owners and validation paths are
explicit. Metadata and AI-readable surfaces should follow stable visible facts, not lead a voice
experiment.

## Surface-Specific Direction

### Homepage

- Present Renda, his current focus, and one useful next action before capability inventories.
- Use first person for the introduction and project ownership.
- Let PersonalWeb, work, and certification details support the story; do not make the visitor decode
  a labeled proof framework.
- Reduce repeated tag, chip, score, and CTA labels when they restate the same positioning.
- Preserve direct resume, project, Chat, and contact access, but establish a clear primary action.

### PersonalWeb And `/docs/`

- Frame the case study around why the project exists, what Renda chose, what the implementation now
  does, how it is validated, what he learned, and the honest limit of the artifact.
- Keep deep architecture, protocol, testing, operations, and CI/CD terminology in the README-backed
  technical material.
- Make the visitor-facing introduction readable without knowing the internal phase or slice history.
- Do not repeat every framework and guardrail in every pillar.

### Certifications

- Lead with the credential and why Renda pursued or values it once that motivation is owner-confirmed.
- Explain the practical architecture foundation in ordinary language before listing domains.
- Keep issue/expiry dates and verification actions exact.
- Use one concise scale limitation; do not let the caveat dominate the credential.

### Chat Guide

- Invite visitors to ask about Renda and PersonalWeb, not to inspect a `public proof` system.
- Keep preset questions short, natural, and controlled by the existing IDs.
- Keep public-source grounding, refusal policy, source hints, telemetry no-op behavior, and the
  same-origin iframe protocol unchanged unless a dedicated slice explicitly changes them.
- If answer tone changes require backend prompt work, split backend and frontend ownership and use
  the backend deployment gates.

### README And Maintainer Docs

- Technical and operational docs may retain precise architecture terms that would be awkward on a
  visitor page.
- README introductions should still sound authored and explain the project before presenting the
  engineering inventory.
- Historical phase documents may keep old terminology when it records an implementation decision.
  Add links to this contract rather than rewriting history without a concrete need.

## Interaction-Expression Contract

Personality in interaction should come from coherent choices, not decoration layered over generic
content.

### Motion

- Use motion to explain entry, selection, progress, or spatial relationship.
- Keep transitions short and token-driven; respect `prefers-reduced-motion`.
- Avoid ambient motion, looping decoration, or animation that competes with reading.
- A motion change must preserve keyboard behavior, focus visibility, layout stability, and Chat
  Widget readiness.

### Color

- Use the existing `default`, `aurora`, and `forest` palettes as distinct but restrained moods.
- Apply color to hierarchy, selected state, focus, and a few authored accents rather than covering
  every section in one hue.
- Preserve neutral reading surfaces and required text/icon contrast.
- Do not create personality through untracked hard-coded colors or decorative gradients unrelated
  to content.

### Imagery

- Prefer Renda's real portrait, real project output, public credential, or inspectable interface
  evidence over generic stock imagery.
- Crop portraits to preserve expression and eye contact at desktop and mobile sizes.
- Use screenshots or diagrams only when they let visitors inspect a real decision or result.
- Keep meaningful alt text factual; decorative images should remain hidden from assistive
  technology.

### Personal Character

- Express personality through selected project decisions, writing rhythm, blog links, learning
  choices, and small visual details that Renda can own.
- Avoid generic motivational slogans, decorative dashboards, fake activity indicators, and
  marketing-style metrics.
- Keep the site work-focused and easy to scan. Personal does not mean informal everywhere.
- A distinctive treatment must still use existing components, tokens, stable dimensions, and
  accessible states unless a dedicated implementation slice approves a new pattern.

## Owner Input Required Before Broad Rewrites

The current public facts are enough to simplify language, but the following questions need Renda's
answer before later slices use the details as personal narrative:

1. Why did you start PersonalWeb, and what problem did you want it to solve for you?
2. Which one or two PersonalWeb decisions best represent how you think as an engineer, and what
   tradeoff did each involve?
3. What is one public-safe lesson or mistake from building or operating PersonalWeb that you are
   comfortable sharing?
4. Why did you pursue AWS Solutions Architect - Associate, and did it change a specific design or
   review habit?
5. Which public work outcome are you most comfortable highlighting now? Confirm whether the
   existing throughput, stockout, team-growth, and role-scope statements should remain prominent.
6. What kind of visitor conversation do you most want after someone reads the site: recruiting,
   technical collaboration, project discussion, writing, or another concrete direction?
7. For Chinese and English, how formal should the first-person voice feel, and are there phrases or
   personal details you explicitly do not want emphasized?

Until answers are confirmed, future slices may improve structure and remove internal jargon, but
must not fabricate motivations, lessons, outcomes, preferences, or anecdotes.

## Ownership And Phase 15 Handoff

| Slice | Primary ownership | Contract application |
| --- | --- | --- |
| `15.4 Homepage Personal Narrative And First Impression` | `src/content/aboutContent.ts`, homepage section components, and existing homepage styles | Apply first-person voice, direct CTA language, lower information density, portrait/palette expression, and owner-confirmed facts only |
| `15.5 PersonalWeb Case Story And Certification Evidence` | `src/content/docsCaseStudyContent.ts`, certifications content/components, README-backed docs, and existing styles | Replace visitor-facing framework language with a human case story while preserving deep technical evidence and exact credential records |
| `15.6 Chat Guide Personal Voice And Guided Flow` | Frontend Chat content/components first; backend only through a separate scoped prompt change | Improve invitation and answer voice while preserving controlled preset IDs, public grounding, privacy, direct chat compatibility, and iframe protocol |
| `15.7 Navigation, Overlay, Contrast, And Mobile Interaction Polish` | Existing navigation, Chat Widget, component styles, and smoke tests | Apply motion, color, focus, dismissal, touch, contrast, overlap, and mobile rules without broad content work |
| `15.8 Metadata Alignment And Phase Close QA` | Metadata constants, `llms.txt`, sitemap, public docs, tests, browser and production checks | Align AI/search surfaces only after visible bilingual claims stabilize; close or split one concrete residual |

Content belongs in `src/content` unless it is route-level metadata or static README-backed material.
Interaction logic remains in components/controllers/services according to the directory ownership
map. This contract does not authorize cross-repository edits.

## Acceptance Checklist

Before approving a future visible Phase 15 rewrite, verify:

- [ ] The first screen identifies Renda and gives a concrete next action.
- [ ] Visitor-facing headings and CTAs do not expose internal planning terms without need.
- [ ] First-person statements describe actions or choices Renda can verify publicly.
- [ ] English reads naturally and avoids generic portfolio cliches.
- [ ] Chinese reads naturally and avoids unnecessary English noun mixing.
- [ ] Both languages preserve facts, certainty, limitation, and destination.
- [ ] Each strong claim maps to visible content or intentionally public documentation.
- [ ] No motivation, anecdote, result, metric, or preference was invented.
- [ ] Technical terms explain a real decision rather than act as decoration.
- [ ] Limitation copy is concise, local to the claim, and not repeated across the page.
- [ ] CTA labels use direct actions and match their destinations.
- [ ] Motion, color, imagery, focus, contrast, reduced motion, and mobile behavior follow existing
  design and interaction standards.
- [ ] Chat privacy, public-source grounding, controlled IDs, and iframe protocol remain unchanged
  unless the slice explicitly owns and validates those changes.
- [ ] Metadata, JSON-LD, `llms.txt`, and sitemap are updated only after visible facts stabilize.

## Validation Expectations

Docs-only contract changes require:

```bash
git diff --check
npm run sync
npm run lint
npm run typecheck
npm run check
pre-commit run --all-files
```

Visible copy, interaction, metadata, Chat, backend, or Nginx changes require the additional gates in
the documents that own those surfaces. This contract does not lower any existing test, privacy,
deployment, or production-validation requirement.
