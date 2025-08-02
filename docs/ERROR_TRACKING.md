<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Error Tracking Integration](#error-tracking-integration)
  - [Setup](#setup)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Error Tracking Integration

This project integrates Sentry for runtime error monitoring and analysis.

## Setup

1. Install dependencies:
   ```bash
   npm install @sentry/astro @sentry/react
   ```
2. Provide the following environment variables in `.env`:
   ```bash
   SENTRY_DSN=<project dsn>
   SENTRY_PROJECT=<project name>
   SENTRY_AUTH_TOKEN=<auth token>
   ```
3. Astro configuration enables the Sentry integration and uploads source maps during builds. Sensitive URLs containing `password` are filtered in `beforeSend`.

## Usage

- Wrap pages with `ErrorBoundary` to automatically capture React errors.
- Network failures inside `apiClient.request` are reported to Sentry.
- Review issues in the Sentry dashboard and configure alerts as needed.
