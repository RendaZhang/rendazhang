<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [ADR 002: Service Layer Abstraction](#adr-002-service-layer-abstraction)
  - [Status](#status)
  - [Context](#context)
  - [Decision](#decision)
  - [Consequences](#consequences)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ADR 002: Service Layer Abstraction

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 04, 2025, 18:05 (UTC+8)

---

## Status

Accepted

---

## Context

API requests were scattered across UI components which made error handling and maintenance difficult.

---

## Decision

Introduce a dedicated service layer and API client utility. All network requests are centralized in `src/services` and constants such as API endpoints are defined in `src/constants/api.js`.

Common HTTP logic lives in `apiClient.request`, which wraps `fetch` and throws descriptive errors on failure.

The base URL can be overridden per environment by setting `PUBLIC_API_BASE_URL` in a `.env` file. Errors are automatically reported to Sentry inside `apiClient.request` for centralized monitoring.

---

## Consequences

- Easier to mock API calls during testing
- Clear separation between data fetching and presentation logic
