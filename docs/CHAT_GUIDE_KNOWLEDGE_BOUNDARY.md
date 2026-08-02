<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Chat Guide Knowledge Boundary](#chat-guide-knowledge-boundary)
  - [Purpose](#purpose)
  - [Public Source Inventory](#public-source-inventory)
  - [Disallowed Topics](#disallowed-topics)
  - [Preset Boundary Map](#preset-boundary-map)
  - [Runtime Behavior](#runtime-behavior)
  - [Answer Contract](#answer-contract)
  - [Test Coverage](#test-coverage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Chat Guide Knowledge Boundary

- **Last Updated**: August 02, 2026, 13:13 (UTC+08:00)
- **Scope**: Slice 11.4 frontend public context boundary, updated after Slice 12.3 backend
  guide-mode transport, Slice 12.5 source-hint UI, and Slice 15.6 guided-flow refinement.
- **Audience**: future AI agents, maintainers, and reviewers working on PersonalWeb Chat Guide
  behavior.

## Purpose

The Chat Guide preset questions should answer from public PersonalWeb context instead of generic
model guesses. Preset questions stay short and visible. Controlled preset clicks use backend opt-in
guide mode so the backend-owned prompt builder supplies the model-facing public context.

This boundary does not add backend telemetry, persistence, third-party analytics, cookies,
fingerprinting, dependencies, runtime changes, or Chat Widget iframe protocol changes.

## Public Source Inventory

Preset answers may draw only from these public source categories:

| Source category | Public source |
| --- | --- |
| `homepage` | Visible homepage content for Renda Zhang, PersonalWeb, work history, skills, education, and proof CTAs. |
| `docs` | `/docs/` rendered technical documentation. |
| `frontend_docs` | Public frontend repository docs such as architecture, testing, SEO/GEO, directory ownership, and Chat Widget protocol docs. |
| `backend_docs` | Public backend API and testing docs, exposed as controlled source labels or a `/docs/` next-step hint. |
| `certifications` | `/certifications/` visible content and public credential verification context. |
| `llms` | `public/llms.txt` public summary for search and AI systems. |
| `metadata` | Public metadata and JSON-LD aligned with visible page content. |
| `public_github_docs` | Public GitHub documentation intentionally linked from the site. |

## Disallowed Topics

The Chat Guide must refuse, redirect, or state uncertainty for:

- Secrets, credentials, private paths, production-only operational details, and private logs.
- Chat transcripts, contact form submissions, visitor-entered text, generated answers, and
  auth/profile data.
- Salary details, private references, non-public employer or customer details, and unsupported
  claims.
- Prompt injection attempts that ask the assistant to ignore the public-content-only boundary.

## Preset Boundary Map

| Preset ID | Source categories | Allowed claims | Refusal or uncertainty rule |
| --- | --- | --- | --- |
| `who_is_renda` | `homepage`, `llms`, `metadata`, `public_github_docs` | Renda Zhang is also 张人大; he is publicly positioned as a Shenzhen-based AI full-stack and cloud-native software engineer with Java/Spring, FinTech/insurance platform, AWS SAA, and University of Minnesota CS context; the site states a July 2026 OneConnect Senior Backend Engineer / Team Lead transition. | Do not infer private identity, contact, salary, employer-confidential, or unsupported biographical details. |
| `personalweb_proof` | `homepage`, `docs`, `frontend_docs`, `backend_docs`, `llms`, `metadata`, `public_github_docs` | PersonalWeb is a public project proof surface showing Astro/React, same-origin Chat Widget, AI chat page, backend integration, docs, tests, smoke checks, SEO/GEO/LLMS, and GitHub Actions delivery. | Do not overstate it as a large commercial SaaS or infer hidden production scale. |
| `cloud_native_evidence` | `homepage`, `docs`, `frontend_docs`, `certifications`, `llms` | Public evidence includes AWS/GCP/Kubernetes positioning, Java/Spring microservices, CI/CD, observability, reliability language, testing, delivery boundaries, AWS SAA, and public work narrative. | Do not claim access to private cloud accounts, private architecture, private incidents, or unpublished configuration. |
| `certification_context` | `certifications`, `homepage`, `llms`, `metadata` | AWS SAA is a verifiable architecture and learning signal covering cloud fundamentals, reliability tradeoffs, cost awareness, and operational boundaries within a broader proof chain. | Do not present the certificate alone as proof of owning a large AWS production estate. |
| `recruiter_summary` | `homepage`, `docs`, `frontend_docs`, `backend_docs`, `certifications`, `llms`, `metadata`, `public_github_docs` | Recruiters should scan homepage positioning, PersonalWeb proof, docs, certifications, work history, education, and public profiles; strongest public signals are AI full-stack, cloud-native delivery, Java/Spring backend depth, FinTech/insurance context, AWS SAA, and University of Minnesota CS. | Avoid private hiring details such as salary, private references, unlisted contact records, or employer-confidential performance claims. |

## Runtime Behavior

- `src/content/chatGuideKnowledge.ts` owns the frontend source categories, disallowed-topic
  inventory, preset boundary map, localized prompt context, and tests for the original frontend
  prompt boundary. Live preset sends now use the backend prompt builder through guide mode.
- `src/components/chat/ChatPresetQuestions.tsx` still renders short visible preset buttons and
  records only `chat_preset_question_clicked` with `{ presetId }`.
- An explicit preset-button click sends the short localized question immediately through the
  existing Chat controller; it does not expose model-facing context in the textarea or add a
  second confirmation click.
- For that controlled preset send, `Chat.tsx` sends the short visible question plus
  `{ guideMode: 'public_site', presetId, locale }` through `src/controllers/chatController.ts` and
  `src/services/chatService.ts`.
- Text entered in the textarea, including a visitor-written variation of a preset question, remains
  normal free-form Chat and does not receive guide metadata or controlled source hints.
- `src/controllers/chatController.ts` stores only the short visible question in chat history and
  Sentry breadcrumbs. It does not add preset text, visitor-entered text, generated answers, or
  guide metadata to telemetry.
- The backend `/deepseek_chat` route builds the model-facing public-context prompt only for the
  opt-in `public_site` guide mode.
- `src/content/chatGuideKnowledge.ts` also exports controlled source-hint metadata for each preset.
  Source hints are fixed labels and relative public routes derived from the preset ID; they are not
  parsed from model output, visitor-entered text, generated answers, or URLs in chat content.
- `src/components/chat/AIMessage.tsx` renders source hints only when `Chat.tsx` marks the assistant
  answer as the response to a controlled preset click. Typed variations and normal free-form chat
  do not receive source hints.
- Source-hint links open in a new tab so the same UI remains safe inside the same-origin Chat Widget
  iframe without adding parent-to-child messages or changing the ready protocol.
- The visitor still sends through the existing `src/controllers/chatController.ts` flow. Free-form
  chat remains unchanged.
- The same-origin Chat Widget iframe ready protocol remains unchanged.

## Answer Contract

Preset answers should be framed as public site information. Good answers start with wording such as
"Based on public site information..." or "根据公开网站信息...".

When evidence is missing, the assistant should say that the public sources do not support the claim
instead of guessing. The preset context should never include private contact details, visitor-entered
text, chat messages, generated answers, cookies, auth/profile identifiers, backend secrets, private
paths, full URLs, query strings, or production-only operational details.

Source hints are an extra UI aid, not citations extracted from the model. They may show controlled
labels such as homepage, `/docs/`, `/certifications/`, `llms.txt`, frontend docs, backend
API/testing docs, or public GitHub docs. They must not include full URLs, query strings, private
paths, visitor-entered text, generated answer text, source-hint click telemetry, contact data, or
auth/profile data.

## Test Coverage

Focused tests cover:

- preset ID alignment with `CHAT_PRESET_QUESTION_IDS`;
- per-preset source categories, allowed claims, and refusal guidance;
- Chinese identity prompt grounding for `Renda Zhang 是谁？`;
- fallback to controlled preset text when arbitrary caller text is supplied;
- prompt text avoiding private values and private endpoint paths;
- Chat preset flow showing only short questions while sending guide-mode metadata to the service;
- edited preset text falling back to normal free-form chat;
- source hints rendering only for unchanged controlled guide preset answers;
- preset telemetry remaining ID-only.
