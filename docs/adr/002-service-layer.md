# ADR 002: Service Layer Abstraction

## Status
Accepted

## Context
API requests were scattered across UI components which made error handling and maintenance difficult.

## Decision
Introduce a dedicated service layer and API client utility. All network requests are centralized in `src/services` and constants such as API endpoints are defined in `src/constants/api.js`.

Common HTTP logic lives in `apiClient.request`, which wraps `fetch` and throws descriptive errors on failure.

The base URL can be overridden per environment by setting `PUBLIC_API_BASE_URL` in a `.env` file. Errors are automatically reported to Sentry inside `apiClient.request` for centralized monitoring.

## Consequences
- Easier to mock API calls during testing
- Clear separation between data fetching and presentation logic
