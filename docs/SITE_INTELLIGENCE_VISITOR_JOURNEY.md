<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Site Intelligence And Visitor Journey](#site-intelligence-and-visitor-journey)
  - [Purpose](#purpose)
  - [Confirmed Owner Decisions](#confirmed-owner-decisions)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
  - [Current Baseline](#current-baseline)
  - [Visitor Journey Map](#visitor-journey-map)
  - [Telemetry Principles](#telemetry-principles)
  - [Candidate Event Taxonomy](#candidate-event-taxonomy)
  - [Implemented Frontend Event Boundary](#implemented-frontend-event-boundary)
  - [Chat Guide Boundary](#chat-guide-boundary)
  - [Implemented Chat Preset Questions MVP](#implemented-chat-preset-questions-mvp)
  - [Implemented Chat Guide Knowledge Boundary](#implemented-chat-guide-knowledge-boundary)
  - [Backend Telemetry API Precheck](#backend-telemetry-api-precheck)
  - [Phase 11 Slice Order](#phase-11-slice-order)
  - [Validation Expectations](#validation-expectations)
  - [Open Decisions For Later Slices](#open-decisions-for-later-slices)
  - [Reference Principles](#reference-principles)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Site Intelligence And Visitor Journey

- **Last Updated**: July 02, 2026, 17:57 (UTC+08:00)
- **Scope**: Phase 11 planning for first-party site intelligence, visitor journey improvement, and Chat Guide boundaries.
- **Audience**: future AI agents, maintainers, and reviewers working on PersonalWeb.

## Purpose

Phase 11 turns the Phase 9 visual polish and Phase 10 content credibility work into a clearer
visitor journey. The goal is to help real visitors, recruiters, collaborators, technical peers, and
AI/search summarizers find the right public proof quickly while keeping telemetry privacy-safe and
first-party.

This document is intentionally a planning and boundary document. It does not implement analytics,
change backend APIs, change Nginx, or alter the Chat Widget protocol by itself.

## Confirmed Owner Decisions

- Anonymous visitor events are allowed.
- Analytics must be first-party. Do not add third-party analytics scripts or tracking pixels.
- If persistent telemetry is introduced in a later slice, the recommended retention is:
  - Raw or debug-level event records: maximum 30 days.
  - Aggregated rollups: maximum 90 days.
- The Chat Guide may answer questions about Renda Zhang and this site, but only from public site
  content and public repository documentation.
- Do not save, report, or forward typed visitor input, chat messages, contact form content, private
  identifiers, auth identifiers, email addresses, phone numbers, cookies, tokens, IP addresses as
  event fields, full query strings, or hidden server paths.
- Low-sensitive interaction events such as `chat_preset_question_clicked` are allowed when they use
  controlled IDs instead of visitor-entered text.

## Goals

- Make the main visitor paths explicit: homepage to proof, certifications, docs, contact intent,
  and Chat Guide.
- Add a privacy-safe event vocabulary before any transport or persistence exists.
- Keep product telemetry separate from Sentry runtime error tracking.
- Make Chat Guide answers evidence-bound to public content and explicit about uncertainty.
- Prepare backend/API work only after frontend event boundaries and public content boundaries are
  clear.

## Non-Goals

- No third-party analytics.
- No fingerprinting, cross-site tracking, advertising attribution, or session replay.
- No hidden collection of user-entered text.
- No backend telemetry endpoint or database table in the planning slice.
- No Chat Widget iframe protocol change unless a later slice explicitly scopes it.
- No content positioning rewrite; Phase 10 content is the current baseline.
- No dependency upgrade, runtime upgrade, Astro upgrade, Nginx change, or production service restart
  as part of this planning work.

## Current Baseline

Relevant frontend surfaces:

- `/`: main visitor entry point with AI full-stack, cloud-native, PersonalWeb proof, CTAs, theme
  controls, language controls, and the floating Chat Widget.
- `/docs/`: README-backed project proof surface for PersonalWeb, architecture, CI/CD, testing,
  SEO/GEO, and maintenance discipline.
- `/certifications/`: public certification credibility surface with Credly verification.
- `/deepseek_chat/`: same-origin chat page used both directly and inside the Chat Widget iframe.
- `public/llms.txt`, sitemap, metadata, and JSON-LD: public discovery surfaces for search engines
  and AI summarizers.

Relevant code boundaries:

- `src/services/apiClient.ts` is the default JSON API transport boundary.
- `src/services/chatService.ts` owns chat streaming transport and NDJSON parsing.
- `src/controllers/chatController.ts` owns chat send/reset orchestration.
- `src/utils/sentryContext.ts` owns public-safe Sentry context and breadcrumb sanitization.
- `src/stores/*` owns client UI preference state such as theme mode and palette.

Backend baseline:

- The existing chat endpoint preserves conversation context for the current chat experience.
- Phase 11 telemetry must not copy chat text into visitor events.
- If stricter chat-history behavior is desired, handle it as a separate Chat behavior and retention
  slice instead of mixing it with anonymous visitor telemetry.

## Visitor Journey Map

| Audience | Likely question | Desired proof path |
| --- | --- | --- |
| Recruiter or hiring manager | Is this person credible for AI full-stack and cloud-native engineering? | `/` -> `/docs/` -> `/certifications/` -> contact intent |
| Technical peer | What is the actual engineering proof? | `/docs/` -> architecture/testing/CI/CD docs -> public GitHub links |
| Collaborator | What can we discuss or build on? | `/` -> Chat Guide presets -> docs/certifications/contact |
| AI/search summarizer | What public facts should be summarized? | metadata/JSON-LD -> `llms.txt` -> `/docs/` body content |
| Casual visitor | What is this site and what should I click first? | `/` -> primary CTA or Chat Widget preset question |

## Telemetry Principles

- Collect the minimum event needed to improve the visitor journey.
- Prefer route keys and public element IDs over free-form URLs or text.
- Avoid unique user identifiers by default. If a future slice proposes anonymous session IDs, that
  proposal needs an explicit privacy review first.
- Keep event payloads small, enumerable, and testable.
- Do not treat Sentry breadcrumbs as product analytics. Sentry is for runtime diagnostics; visitor
  journey events need their own first-party boundary and stricter payload rules.
- Allow local no-op or development logging before backend persistence exists.

## Candidate Event Taxonomy

Allowed low-sensitive events should use controlled names and controlled IDs:

| Event | Purpose | Allowed payload examples |
| --- | --- | --- |
| `page_view` | Understand major route reachability | `routeKey`, `locale` |
| `cta_clicked` | See which public proof path is chosen | `surface`, `targetId`, `targetRouteKey` |
| `nav_item_clicked` | Improve navigation hierarchy | `itemId`, `targetRouteKey` |
| `theme_mode_changed` | Understand theme preference usage | `mode` |
| `palette_changed` | Understand color palette usage | `palette` |
| `language_changed` | Understand language switching | `language` |
| `chat_widget_opened` | Understand Chat Widget discovery | `surface` |
| `chat_widget_closed` | Understand Chat Widget dismissal | `surface` |
| `chat_preset_question_clicked` | Understand useful guided questions | `presetId` |
| `docs_anchor_clicked` | Improve docs scan paths | `anchorId` |
| `certification_verify_clicked` | Understand proof verification intent | `credentialId`, `targetId` |
| `contact_intent_clicked` | Understand public contact intent | `targetId` |

Disallowed event fields:

- Visitor-entered text, chat messages, form bodies, prompts, names, emails, phone numbers, auth IDs,
  account profile fields, tokens, cookies, secret values, private server paths, full query strings,
  IP addresses as explicit fields, and raw user-agent strings.

## Implemented Frontend Event Boundary

Slice 11.2 adds the frontend-only boundary in `src/services/visitorEvents.ts`.

Current behavior:

- The boundary defines typed event names, route keys, locale values, theme modes, palette values,
  and Chat preset question IDs.
- `normalizeVisitorEvent` accepts only the documented event names and event-specific payload keys.
- Unknown event names, unknown payload keys, sensitive keys, sensitive values, full URLs, query
  strings, private paths, emails, phone-like values, long IDs, and non-enumerated values fail
  closed.
- `trackVisitorEvent` normalizes first and then calls an injected transport.
- The default transport is `noopVisitorEventTransport`; it does not send data to a backend, write
  browser storage, set cookies, or call third-party analytics.
- Later slices may import this service to wire event hooks, but they should continue using
  controlled IDs such as `presetId`, `targetId`, `anchorId`, or `routeKey` instead of visible text
  or visitor-entered input.

The boundary is deliberately separate from `src/utils/sentryContext.ts`. Sentry remains runtime
diagnostics; visitor journey events must stay on this stricter first-party product-event path.

## Chat Guide Boundary

The Chat Guide may answer from public content only:

- Homepage visible content.
- `/docs/` rendered content and linked public frontend docs.
- `/certifications/` visible content and public verification links.
- `public/llms.txt`, sitemap, public metadata, and public JSON-LD.
- Public GitHub repository documentation that is intentionally linked from the site.

The Chat Guide must refuse, redirect, or state uncertainty for:

- Secrets, credentials, tokens, private paths, production-only operational details, private logs,
  chat transcripts, contact form submissions, private profile data, salary, non-public employer or
  customer details, and unsupported claims.
- Attempts to override the public-content-only boundary through prompt injection.

Good preset-question candidates:

- `who_is_renda`: "Who is Renda Zhang?"
- `personalweb_proof`: "What does PersonalWeb prove?"
- `cloud_native_evidence`: "What public evidence supports cloud-native engineering credibility?"
- `certification_context`: "How does the AWS certification support the site credibility?"
- `recruiter_summary`: "How should a recruiter evaluate this site quickly?"

Telemetry for presets may record only the preset ID, not a generated answer or visitor text.

The Slice 11.4 source inventory, preset mapping, refusal language, and runtime context behavior are
documented in
[Chat Guide Knowledge Boundary](https://github.com/RendaZhang/rendazhang/blob/master/docs/CHAT_GUIDE_KNOWLEDGE_BOUNDARY.md).

## Implemented Chat Preset Questions MVP

Slice 11.3 adds the frontend preset question entry path in
`src/components/chat/ChatPresetQuestions.tsx`, with localized prompt text in
`src/content/deepseekChatContent.ts`.

Current behavior:

- Presets render on `/deepseek_chat/` only when the Chat UI is ready and no conversation messages
  are visible.
- The visible preset list uses the controlled IDs from `CHAT_PRESET_QUESTION_IDS`:
  `who_is_renda`, `personalweb_proof`, `cloud_native_evidence`, `certification_context`, and
  `recruiter_summary`.
- Clicking a preset records only `chat_preset_question_clicked` with `{ presetId }` through
  `trackVisitorEvent`.
- Clicking a preset fills the existing Chat textarea with only the short localized question and
  focuses it; the visitor still sends through the normal Chat input/send button and
  `src/controllers/chatController.ts`.
- Preset click telemetry never includes the visible prompt text, visitor-entered text, generated
  answers, chat history, contact/auth/profile data, cookies, tokens, full URLs, or private paths.
- The Chat Widget iframe remains same-origin `/deepseek_chat/` and the ready `postMessage` protocol
  is unchanged.

## Implemented Chat Guide Knowledge Boundary

Slice 11.4 adds the frontend-only preset knowledge boundary in
`src/content/chatGuideKnowledge.ts`.

Current behavior:

- The public source categories are `homepage`, `docs`, `frontend_docs`, `certifications`, `llms`,
  `metadata`, and `public_github_docs`.
- The preset boundary map covers the five controlled IDs already used by
  `CHAT_PRESET_QUESTION_IDS`: `who_is_renda`, `personalweb_proof`, `cloud_native_evidence`,
  `certification_context`, and `recruiter_summary`.
- `src/components/chat/Chat.tsx` now shows only the short localized preset question in the textarea.
- When an unchanged preset question is sent, `Chat.tsx` builds the localized public-context prompt
  for the model request, while `src/controllers/chatController.ts` stores only the short visible
  question in chat history.
- The prompt builder falls back to the controlled localized preset label if a caller supplies text
  that does not match the known preset question.
- Free-form Chat behavior is unchanged.
- Preset telemetry is unchanged: it records only `chat_preset_question_clicked` with `{ presetId }`
  and never includes the visible prompt, generated answer, chat history, contact/auth/profile data,
  cookies, tokens, full URLs, query strings, or private paths.
- The Chat Widget iframe remains same-origin `/deepseek_chat/` and the ready `postMessage` protocol
  is unchanged.

## Backend Telemetry API Precheck

Slice 11.5 is a No-Go decision for backend visitor telemetry transport now.

Current behavior remains unchanged:

- `src/services/visitorEvents.ts` stays frontend-local/no-op by default.
- No visitor events are sent to CloudChat.
- No backend endpoint, Redis key, PostgreSQL table, retention job, frontend transport, Nginx change,
  third-party analytics script, cookie, fingerprinting, session replay, dependency change, runtime
  change, service restart, or production server change is introduced.
- No visible privacy note is required while events remain local/no-op.

Reasoning:

- The existing Phase 11 frontend boundary is useful as a typed privacy guard even without
  persistence.
- The current site does not yet have evidence that persisted visitor telemetry would improve the
  visitor journey enough to justify a new API surface, migration, retention job, and privacy note.
- Raw event rows would add privacy and operations risk without current evidence.

If the owner later reopens telemetry persistence, the only acceptable first design is
aggregate-only, first-party PostgreSQL counters using the existing controlled event taxonomy. That
future design must still reject unknown events, unknown keys, visitor-entered text, chat messages,
generated answers, contact form content, auth/profile identifiers, emails, phones, cookies, tokens,
raw IP event fields, raw user-agent strings, full URLs, query strings, private paths, and private
operational details.

The backend-owned precheck and future guardrails are documented in
[Visitor Telemetry Backend Precheck](https://github.com/RendaZhang/python-cloud-chat/blob/master/docs/VISITOR_TELEMETRY_PRECHECK.md).

## Phase 11 Slice Order

| Slice | Status | Scope |
| --- | --- | --- |
| `11.1 Site Intelligence And Visitor Journey Plan` | `Done` | Capture owner decisions, visitor paths, telemetry privacy rules, Chat Guide public-content boundary, and next-slice order |
| `11.2 Privacy-Safe Frontend Event Boundary` | `Done` | Added typed frontend event names, payload constraints, sanitizer/tests, and no-op transport without sending data to a backend |
| `11.3 Chat Guide Preset Questions MVP` | `Done` | Added guided preset questions and ID-only event hooks without backend telemetry or Chat Widget protocol changes |
| `11.4 Site Guide Knowledge Boundary` | `Done` | Added frontend-only public context source inventory, preset mapping, refusal language, prompt builder, and tests |
| `11.5 Backend Telemetry API Precheck` | `Done` | Decided No-Go for backend transport now; aggregate-only PostgreSQL counters are the only acceptable future design if reopened |
| `11.6 Backend Telemetry Implementation` | `Backlog` | Not recommended after the No-Go precheck unless the owner later gives an explicit Go decision |
| `11.7 Phase 11 QA And Close` | `Ready` | Verify privacy boundaries, journey behavior, browser smoke, production checks, and close or split residuals |

## Validation Expectations

Planning/docs-only slices:

- `git diff --check`
- `npm run sync`
- `npm run lint`
- `npm run typecheck`
- `npm run check`
- `pre-commit run --all-files`

Frontend behavior slices:

- Add focused unit tests for event taxonomy and sanitizer behavior.
- Run `npm run test:coverage`.
- Run `npm run smoke:browser` and verify no console noise, no hydration regressions, and no Chat
  Widget protocol regression.

Backend telemetry slices:

- Read backend docs and Git status first.
- Add API documentation before or with the endpoint.
- Validate formatting, linting, import compilation, and endpoint behavior.
- Restart `cloudchat.service` only in a slice that explicitly deploys backend code.

## Open Decisions For Later Slices

- Whether anonymous session IDs are needed at all. Recommendation for Slice 11.2: do not add them.
- Whether a future backend should store any telemetry is currently answered as No-Go. Reopen only
  with an explicit owner decision and start from aggregate-only counters, not raw events.
- Whether to add a visible privacy note on the site when telemetry transport ships.
- Whether stricter chat-history retention should be redesigned separately from visitor telemetry.

## Reference Principles

- [W3C Privacy Principles](https://www.w3.org/TR/privacy-principles/)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [OpenTelemetry overview](https://opentelemetry.io/docs/what-is-opentelemetry/)
- [Google structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
