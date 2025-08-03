<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Sentry Error Tracking Integration](#sentry-error-tracking-integration)
  - [Setup](#setup)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Sentry Error Tracking Integration

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 04, 2025, 00:54 (UTC+8)

---

This project integrates Sentry for runtime error monitoring and analysis.

---

## Setup

1. Install dependencies:
   ```bash
   npm install @sentry/astro @sentry/react
   ```
2. Provide the following environment variables in `.env`:
   ```bash
   SENTRY_DSN=<server dsn>
   PUBLIC_SENTRY_DSN=<browser dsn>
   SENTRY_PROJECT=<project name>
   SENTRY_AUTH_TOKEN=<auth token>
   ```
3. Astro configuration enables the Sentry integration and uploads source maps during builds. Sensitive URLs containing `password` are filtered in `beforeSend`.

---

## Usage

- Wrap pages with `ErrorBoundary` to automatically capture React errors.
- Network failures inside `apiClient.request` are reported to Sentry.
- Review issues in the Sentry dashboard and configure alerts as needed.
