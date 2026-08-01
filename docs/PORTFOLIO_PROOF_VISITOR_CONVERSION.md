<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Portfolio Proof And Visitor Conversion](#portfolio-proof-and-visitor-conversion)
  - [Purpose](#purpose)
  - [Phase 14 Direction](#phase-14-direction)
  - [Current Documentation Readiness](#current-documentation-readiness)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
  - [Primary Surfaces](#primary-surfaces)
  - [Visitor Proof Paths](#visitor-proof-paths)
  - [Slice 14.1 Audit Result](#slice-141-audit-result)
  - [Slice 14.2 Implementation Result](#slice-142-implementation-result)
  - [Slice 14.3 Implementation Result](#slice-143-implementation-result)
  - [Implementation Principles](#implementation-principles)
  - [Candidate Slice Order](#candidate-slice-order)
  - [Validation Expectations](#validation-expectations)
  - [Open Decisions](#open-decisions)
  - [Related Documents](#related-documents)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Portfolio Proof And Visitor Conversion

- **Last Updated**: August 01, 2026, 16:48 (UTC+08:00)
- **Scope**: Phase 14 planning for portfolio proof, visitor proof paths, and conversion-oriented
  presentation across the PersonalWeb frontend.
- **Audience**: future AI agents, maintainers, and reviewers working on PersonalWeb portfolio and
  product-experience slices.

## Purpose

Phase 14 turns the completed visual polish, content credibility, Chat Guide grounding, and
operations baseline into a stronger portfolio experience. The goal is not to add more claims. The
goal is to help visitors find the existing public proof faster, understand what PersonalWeb proves,
and choose a clear next step.

This document is a planning and boundary document. It does not implement UI, change frontend
behavior, modify backend APIs, change Nginx, add analytics, or alter production services by itself.

## Phase 14 Direction

Recommended phase name:

`Phase 14: Portfolio Proof And Visitor Conversion`

Primary theme:

- Make PersonalWeb feel like a deliberate portfolio proof surface, not only a personal site with
  good documentation.
- Improve the path from first impression to evidence: homepage -> project proof -> architecture /
  tests / CI/CD -> certifications -> Chat Guide -> contact intent.
- Keep the site professional, technical, creative, and public-safe.
- Use the existing Astro 7 / React / docs / Chat Guide / Nginx baseline instead of reopening
  architecture or operations work.

The phase should start with an audit slice. Do not implement a homepage redesign, architecture map,
new component system, metadata rewrite, or Chat Guide behavior change before the current proof paths
and gaps are inspected.

## Current Documentation Readiness

The existing document set is sufficient to start Phase 14, but it needed this explicit phase entry
point.

| Area | Existing support | Readiness |
| --- | --- | --- |
| Content positioning | `docs/CONTENT_CREDIBILITY_POSITIONING.md` defines the AI full-stack / cloud-native positioning, proof pillars, and public-safety boundaries. | Ready |
| Visitor journey | `docs/SITE_INTELLIGENCE_VISITOR_JOURNEY.md` defines main audience paths, privacy-safe event boundaries, and Chat Guide public-content scope. | Ready |
| Chat Guide quality | `docs/CHAT_GUIDE_QUALITY_ARCHITECTURE.md` and `docs/CHAT_GUIDE_KNOWLEDGE_BOUNDARY.md` define source-bounded guide behavior and refusal boundaries. | Ready |
| Frontend architecture | `docs/FRONTEND_ARCHITECTURE.md`, `docs/DIRECTORY_OWNERSHIP.md`, and `docs/CHAT_WIDGET_PROTOCOL.md` define Astro, React island, service, CSP, iframe, and Chat Widget boundaries. | Ready |
| Visual and interaction system | `docs/VISUAL_INTERACTION_POLISH.md`, `docs/STYLE_GUIDE.md`, `docs/INTERACTION_COMPONENT_STANDARDS.md`, and `docs/THEME_PALETTE_TOKEN_MODEL.md` define visual, palette, focus, keyboard, motion, and component-state standards. | Ready |
| Human voice and personal expression | `docs/HUMAN_VOICE_PERSONAL_EXPRESSION.md` defines the Phase 15 bilingual editorial contract, visitor-versus-maintainer terminology, owner-input gates, and interaction-expression principles for later rewrites. | Ready |
| Validation and operations | `docs/TESTING.md`, `docs/OPERATIONS.md`, `docs/CI_CD.md`, and `docs/DEPENDENCY_SECURITY_RISK_REGISTER.md` define test gates, deploy checks, log-noise expectations, and dependency-risk boundaries. | Ready |
| Phase 14 handoff | This document defines the portfolio proof and conversion phase boundaries, surfaces, slices, and validation expectations. | Ready |

Conclusion: future agents can start Phase 14 from the docs alone if they read this document plus the
related documents listed below. The remaining unknowns are product/design decisions, not missing
project context.

## Goals

Phase 14 should make it easier for mixed-audience visitors to answer:

- Who is Renda Zhang, in one scan?
- What does PersonalWeb prove as an engineering artifact?
- Where is the strongest technical evidence?
- How do the certificate, work history, docs, and Chat Guide support the same positioning?
- What is the next useful action for a recruiter, technical peer, collaborator, or casual visitor?

Strong outcomes:

- A clearer PersonalWeb case-study or proof surface.
- Homepage CTAs and section flow that guide visitors toward evidence, not just page navigation.
- A lightweight architecture or system map that makes the project easier to understand.
- Chat Guide entry points and preset language that support the same proof path.
- Browser/mobile QA evidence that the proof path works across common viewports.

## Non-Goals

Phase 14 is not:

- A broad resume rewrite or a new content-positioning phase.
- A new visual redesign phase; Phase 9 remains the visual polish baseline.
- A dependency, runtime, Astro, Sentry, Vite, React, Vitest, Playwright, Python, Redis,
  PostgreSQL, or Nginx upgrade phase.
- A backend Chat model, prompt, database, telemetry, analytics, cookie, tracking, or retention
  phase unless a later slice explicitly scopes a narrow Chat Guide alignment.
- A production-operations phase; Phase 13 is closed.
- A reason to add private credentials, private server paths, private employer/customer details,
  private logs, hidden analytics, visitor-entered text collection, or non-public operational data.

## Primary Surfaces

Phase 14 may inspect or improve these public frontend surfaces:

| Surface | Role in Phase 14 |
| --- | --- |
| `/` homepage | First impression, proof hierarchy, CTA routing, and Chat Widget discovery |
| `/docs/` README-backed docs page | Existing PersonalWeb proof surface and technical evidence index |
| `/certifications/` | Verifiable architecture/learning signal in the proof chain |
| `/deepseek_chat/` and Chat Widget | Interactive guide into public proof and site navigation |
| README / public docs | Public repository proof, architecture, testing, CI/CD, operations, and handoff context |
| `llms.txt`, sitemap, JSON-LD, metadata | Search and AI-summary alignment after visible proof paths are stable |

## Visitor Proof Paths

Phase 14 should preserve mixed-audience paths:

| Audience | First question | Desired path |
| --- | --- | --- |
| Recruiter / hiring manager | Is this person credible quickly? | Homepage proof summary -> PersonalWeb proof -> certifications -> contact intent |
| Technical peer | What is the real engineering artifact? | Homepage or docs -> architecture/testing/CI/CD evidence -> GitHub docs |
| Collaborator | What can we discuss or build on? | Homepage -> Chat Guide presets -> project proof / docs / contact |
| AI/search summarizer | What public facts should be summarized? | metadata/JSON-LD -> `llms.txt` -> `/docs/` body -> homepage content |
| Casual visitor | What should I click first? | Homepage proof path or Chat Widget guided question |

## Slice 14.1 Audit Result

Slice 14.1 audited the current production homepage, `/docs/`, `/certifications/`,
`/deepseek_chat/`, homepage Chat Widget open state, README-backed docs content, metadata,
`llms.txt`, sitemap, and the relevant frontend content/components. The audit did not find a
release blocker or a reason to change runtime behavior before implementation.

Local desktop/mobile screenshots and console summaries were captured for audit evidence and were
not committed. The captured production pages had no console warnings or errors in the audited
states.

| Surface | Current strength | Gap / risk | Decision |
| --- | --- | --- | --- |
| Homepage first screen | The hero already leads with AI full-stack, cloud-native, FinTech, PersonalWeb proof, and a primary `View Technical Proof` CTA to `/docs/`. Desktop first viewport shows the next section. | Mobile first viewport makes the short proof scroll cue visible, but the primary CTA buttons are not the strongest visible action. The destination is also a long docs page rather than a scan-first proof surface. | Keep homepage behavior unchanged until the proof destination is clearer. Queue homepage CTA/path work after the case-study surface. |
| Homepage section order | The current order exposes bio, education, blog, skills, experience, then contact, with PersonalWeb proof described in the bio content. | The proof chain is available but visitors must assemble it from multiple sections. Recruiters and casual visitors may reach education/blog before a concentrated project proof story. | Revisit section and CTA flow in Slice 14.3, after Slice 14.2 defines the target proof surface. |
| `/docs/` | README-backed docs already contain the strongest PersonalWeb evidence: project proof, stack, architecture, frontend/backend/Nginx boundaries, CI/CD, testing, SEO/GEO, and operations links. | The first screen is a README/table-of-contents reading experience. It is technically strong but not a visitor-facing case-study surface with a clear conclusion, evidence chain, boundaries, and next action. | Implement `14.2 PersonalWeb Case Study Surface` first, using `/docs/` or a linked section as the primary proof owner. |
| README / public docs | Public docs are deep enough for technical peers and AI/search summarizers. | Evidence is distributed across many docs, so non-technical visitors need a shorter proof path before being sent to deep maintenance docs. | Keep README/docs as source evidence, but add a scan-friendly front layer instead of duplicating every detail. |
| `/certifications/` | Certification copy already explains AWS SAA as an architecture credibility signal and explicitly avoids overstating large AWS production ownership. | It is supporting proof, not the main PersonalWeb artifact proof. | Leave certification behavior/content alone for now. Link it as proof-chain support from the later case-study/homepage path if needed. |
| Chat Guide presets and widget | Presets align with the proof path: Renda identity, PersonalWeb proof, cloud-native evidence, AWS certification context, and recruiter summary. The Chat Widget iframe opens with the same preset entry and clean console state. | Chat is useful as a guide, but it should not become the first place visitors must go to understand the proof hierarchy. | Do not change Chat Guide behavior or preset wording in Slice 14.1. Revisit entry copy only after visible proof surfaces land. |
| Metadata, JSON-LD, `llms.txt`, sitemap | Search and AI-summary surfaces already reflect AI full-stack, cloud-native engineering, PersonalWeb proof, certifications, and main public pages. | Updating these before visible proof-surface changes would create churn and risk describing a surface that is not yet landed. | Defer metadata, JSON-LD, `llms.txt`, and sitemap updates until visible proof content changes in later slices. |

Answered implementation decisions:

| Decision | Slice 14.1 answer |
| --- | --- |
| Strongest proof owner | Put the strongest visitor-facing proof layer in `/docs/` or a linked docs section first. Do not create a new standalone route in the next slice unless implementation discovery proves the existing docs route cannot support it cleanly. |
| `14.2` versus `14.3` order | Implement `14.2 PersonalWeb Case Study Surface` before `14.3 Homepage Proof Path And CTA Flow`. The homepage already has a proof CTA; it needs a clearer target before CTA hierarchy is tuned. |
| Architecture/system map | Defer a separate interactive architecture map. Slice 14.2 may include a lightweight static architecture/proof summary if it helps scanability, but a heavier interactive map should wait for evidence that it improves comprehension. |
| Primary CTA strategy | Recruiter path should become homepage -> PersonalWeb proof surface -> certifications/contact. Technical peer path should be homepage or docs -> architecture/testing/CI/CD evidence -> public repo docs. |
| Chat Guide alignment | Keep current presets for now. Later Chat Guide entry work should support the new proof path without changing iframe protocol, backend prompt behavior, or visitor-event privacy. |
| SEO/GEO timing | Wait until visible proof-surface changes land before changing metadata, JSON-LD, `llms.txt`, or sitemap. |

## Slice 14.2 Implementation Result

Slice 14.2 added the PersonalWeb case-study proof surface to the top of `/docs/`, before the long
README-backed Markdown bodies. The implementation keeps the existing docs route as the proof owner,
adds no new standalone route, and keeps README/docs as the deeper source of truth.

Implemented frontend ownership:

| Area | Owner |
| --- | --- |
| Bilingual case-study copy | `src/content/docsCaseStudyContent.ts` |
| Static visitor-facing section | `src/components/sections/DocsCaseStudySurface.astro` |
| Route placement | `src/pages/docs.astro`, above the README-backed Markdown containers |
| Visual treatment | `src/styles/components/docs.css`, using existing docs/theme/palette tokens |

The surface summarizes the project conclusion, six proof pillars, direct evidence links, boundary
language, and next actions. It routes visitors into existing public evidence instead of duplicating
maintenance documentation:

- architecture and system-boundary anchors inside `/docs/`;
- CI/CD and validation anchors inside `/docs/`;
- `/certifications/` for AWS certification context;
- `/deepseek_chat/` for the public-source Chat Guide;
- homepage contact section for direct contact intent.

The boundary language is intentionally explicit: PersonalWeb is a public personal engineering
artifact and should not be read as proof of a large commercial SaaS, hidden production traffic,
private customer systems, private server details, visitor messages, or form submissions.

No homepage CTA flow, Chat Guide behavior, preset wording, metadata, JSON-LD, `llms.txt`, sitemap,
backend code, Nginx config, dependencies, runtime pins, telemetry, analytics, cookies, production
services, SSH, service restart, or Nginx reload changed in this slice.

Follow-up decision: `14.3 Homepage Proof Path And CTA Flow` is now the next concrete slice because
the proof destination exists and can be used as the target for desktop/mobile homepage CTA hierarchy.

## Slice 14.3 Implementation Result

Slice 14.3 aligned the homepage first proof path with the `/docs/` PersonalWeb case-study surface.
The implementation keeps the homepage as the usable first screen and routes visitors toward existing
evidence instead of repeating the full case study inline.

Implemented frontend ownership:

| Area | Owner |
| --- | --- |
| Homepage proof-path copy | `src/content/aboutContent.ts` |
| Homepage proof-path section | `src/components/sections/HomepageProofPathSection.tsx` |
| Hero CTA labels and routes | `src/components/sections/HeroSection.tsx` |
| Homepage proof-path and mobile CTA styling | `src/styles/components/about.css` |
| Site navigation style scoping | `src/styles/components/navigation/navigation.css` |
| Browser smoke coverage | `tests/smoke/browser-hydration.spec.ts` |

The homepage now presents:

- primary hero CTA: `/docs` with `查看 PersonalWeb 案例` / `View PersonalWeb Case Study`;
- secondary hero CTA: `#proof-path` with `选择证明路径` / `Choose Proof Path`;
- a compact proof-path section after the hero/social links with routes to `/docs`,
  `/certifications`, `/deepseek_chat`, and `#contact`;
- mobile first-screen CTA visibility at `390x844`, with the proof-path section visible below the
  hero.

During smoke validation, the new proof-path `<nav>` exposed an existing global-style hazard: the
site navigation stylesheet targeted bare `nav` elements and made every `<nav>` fixed at the top of
the viewport. Slice 14.3 narrowed that rule to `.c-nav-container > nav`, so proof-path navigation
and docs/case-study navigation can remain in normal document flow while the real top navigation
keeps its fixed behavior.

No Chat Guide preset, backend prompt behavior, metadata, JSON-LD, `llms.txt`, sitemap, backend,
Nginx, dependency, runtime, telemetry, analytics, cookie, visitor-event persistence, production
service, SSH, service restart, or Nginx reload changed.

Follow-up decision: no architecture-map defect was proven by this slice. Keep `14.4` conditional
and move the next concrete implementation toward Chat Guide entry / preset alignment, because the
homepage now includes a public proof path that points visitors to the existing guide experience.

## Implementation Principles

- Start with audit and proof-path mapping before changing UI.
- Prefer reusing current components, content modules, tokens, and docs pages.
- Keep implementation slices narrow: one proof surface or one interaction path at a time.
- Do not duplicate facts across pages unless there is a clear owner for future updates.
- Keep claims evidence-bound. Do not imply hidden scale, private infrastructure, private customer
  work, private traffic, or non-public employer details.
- If adding an interactive architecture map, keep it lightweight, accessible, mobile-safe, and
  useful without JavaScript-heavy decoration.
- If changing Chat Guide entry points, keep the same same-origin iframe protocol, public-source
  boundary, and no-op visitor-event privacy posture unless a slice explicitly changes them.
- Update SEO/GEO, `llms.txt`, sitemap, and structured data only after visible content changes land.

## Candidate Slice Order

| Slice | Status | Scope |
| --- | --- | --- |
| `14.1 Portfolio Journey Audit And Phase Plan` | `Done` | Audited homepage, docs, certifications, Chat Guide, CTA flow, metadata, and docs support; confirmed case-study surface should precede homepage CTA changes |
| `14.2 PersonalWeb Case Study Surface` | `Done` | Added a bilingual scan-friendly case-study proof layer at the top of `/docs/`, with evidence links, next actions, and explicit proof boundaries |
| `14.3 Homepage Proof Path And CTA Flow` | `Done` | Refined hero CTA labels/routes, added a compact homepage proof-path section, preserved mobile first-screen CTA visibility, and scoped top-nav styling so proof-path nav stays in document flow |
| `14.4 Lightweight Architecture / System Map` | `Backlog` | Add only a lightweight static or low-complexity architecture/proof map if the case-study surface shows it improves comprehension; preserve accessibility, mobile layout, and bundle discipline |
| `14.5 Chat Guide Entry And Preset Alignment` | `Ready` | Align Chat Guide entry points and preset wording with the new proof path while preserving public-source and privacy boundaries |
| `14.6 Browser Mobile Conversion QA And Metadata Alignment` | `Backlog` | Verify proof paths across desktop/mobile and update SEO/GEO, `llms.txt`, sitemap, and structured data only if visible content changed |
| `14.7 Phase Close Review` | `Backlog` | Close Phase 14 or split one narrow follow-up if QA finds a concrete proof-path, docs, mobile, or metadata defect |

This order reflects the Slice 14.1 audit. If a later candidate becomes mostly content strategy,
backend behavior, telemetry, dependency work, or operations cleanup, move it out of Phase 14.

## Validation Expectations

Planning/docs-only slices:

```bash
git diff --check
npm run sync
npm run lint
npm run typecheck
npm run check
pre-commit run --all-files
```

Frontend behavior or visible-content slices should add:

- `npm run test:coverage` when React components, content logic, metadata helpers, or Chat Guide
  boundaries are touched.
- `npm run smoke:browser` when homepage, navigation, Chat Widget, theme/palette, docs rendering,
  hydration, iframe, or CSP-sensitive paths are touched.
- Browser or Playwright QA for desktop and mobile proof paths, including console checks.
- Read-only production checks after frontend deploy for `/`, `/docs/`, `/deepseek_chat/`,
  `/certifications/`, `llms.txt`, `sitemap.xml`, and `/cloudchat/auth/healthz` as relevant.

Do not run backend service restarts, Nginx reloads, or production SSH for Phase 14 unless a later
slice explicitly scopes and justifies that work.

## Open Decisions

Slice 14.1 closed the initial ordering decisions above. Remaining owner decisions should be scoped
inside later implementation slices, not reopened as broad Phase 14 questions:

- Slice 14.2 placed the case-study surface at the top of `/docs/`; no standalone route was needed.
- Slice 14.3 finalized the homepage CTA labels, proof-path routing, and mobile first-screen CTA
  treatment.
- Slice 14.4 should proceed only if a lightweight architecture/proof map has a concrete
  comprehension role after Slice 14.2.
- Slice 14.5 should align Chat Guide entry / preset wording with the public proof path before
  metadata or structured-data work.
- Slice 14.6 should update SEO/GEO, `llms.txt`, sitemap, and structured data only after visible
  proof changes are deployed.

## Related Documents

- [Human Voice And Personal Expression](./HUMAN_VOICE_PERSONAL_EXPRESSION.md)
- [Content And Credibility Positioning](./CONTENT_CREDIBILITY_POSITIONING.md)
- [Site Intelligence And Visitor Journey](./SITE_INTELLIGENCE_VISITOR_JOURNEY.md)
- [Chat Guide Quality Architecture](./CHAT_GUIDE_QUALITY_ARCHITECTURE.md)
- [Chat Guide Knowledge Boundary](./CHAT_GUIDE_KNOWLEDGE_BOUNDARY.md)
- [Frontend Architecture Conventions](./FRONTEND_ARCHITECTURE.md)
- [Frontend Directory Ownership Map](./DIRECTORY_OWNERSHIP.md)
- [Chat Widget Protocol](./CHAT_WIDGET_PROTOCOL.md)
- [Visual Interaction Polish](./VISUAL_INTERACTION_POLISH.md)
- [Interaction Component Standards](./INTERACTION_COMPONENT_STANDARDS.md)
- [Testing Guide](./TESTING.md)
- [SEO / GEO Maintenance](./SEO_GEO.md)
- [Operations Maintenance Guide](./OPERATIONS.md)
