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
  - [Implementation Principles](#implementation-principles)
  - [Candidate Slice Order](#candidate-slice-order)
  - [Validation Expectations](#validation-expectations)
  - [Open Decisions](#open-decisions)
  - [Related Documents](#related-documents)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Portfolio Proof And Visitor Conversion

- **Last Updated**: July 05, 2026, 15:29 (UTC+08:00)
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
| `14.1 Portfolio Journey Audit And Phase Plan` | `Ready` | Audit homepage, docs, certifications, Chat Guide, CTA flow, metadata, and docs support; update this plan and roadmap without implementing UI |
| `14.2 PersonalWeb Case Study Surface` | `Backlog` | Turn the existing PersonalWeb proof into a clearer scan-friendly case-study surface, likely in `/docs/` or a linked section, without overstating scale |
| `14.3 Homepage Proof Path And CTA Flow` | `Backlog` | Improve homepage proof hierarchy and CTA routing so visitors can reach the strongest evidence faster |
| `14.4 Interactive Architecture / System Map MVP` | `Backlog` | Add a lightweight architecture/system map if the audit confirms it improves comprehension; preserve accessibility, mobile layout, and bundle discipline |
| `14.5 Chat Guide Entry And Preset Alignment` | `Backlog` | Align Chat Guide entry points and preset wording with the new proof path while preserving public-source and privacy boundaries |
| `14.6 Browser Mobile Conversion QA And Metadata Alignment` | `Backlog` | Verify proof paths across desktop/mobile and update SEO/GEO, `llms.txt`, sitemap, and structured data only if visible content changed |
| `14.7 Phase Close Review` | `Backlog` | Close Phase 14 or split one narrow follow-up if QA finds a concrete proof-path, docs, mobile, or metadata defect |

Actual order may change after Slice 14.1. If a candidate becomes mostly content strategy, backend
behavior, telemetry, dependency work, or operations cleanup, move it out of Phase 14.

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

Slice 14.1 should answer these before implementation:

- Should the strongest PersonalWeb proof live primarily on `/docs/`, the homepage, or a new
  dedicated page?
- Is an interactive architecture/system map worth the added UI and bundle complexity, or is a
  static scan-friendly case-study section enough?
- Which CTA should be the primary proof CTA for recruiters versus technical peers?
- Should Chat Guide presets be adjusted to route visitors through the proof path, or should they
  remain mostly question-answer oriented?
- Should SEO/GEO and `llms.txt` change in Phase 14, or only after visible proof surfaces change?

## Related Documents

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
