/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />

declare module '*?url' {
  const value: string;
  export default value;
}

declare module '*?raw' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.astro' {
  import type { AstroComponent } from 'astro';
  const component: AstroComponent;
  export default component;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PUBLIC_API_BASE_URL?: string;
      readonly PUBLIC_CDN_BASE?: string;
      readonly PUBLIC_NODE_ENV?: string;
      readonly PUBLIC_SENTRY_DSN?: string;
      readonly PUBLIC_SITE_BASE_URL?: string;
      readonly PUBLIC_TAG_NAME?: string;
      readonly SENTRY_DSN?: string;
      readonly SENTRY_AUTH_TOKEN?: string;
      readonly SENTRY_ORG?: string;
      readonly SENTRY_PROJECT?: string;
      readonly SKIP_SENTRY?: string;
      readonly NODE_ENV?: string;
    }
  }

  interface ImportMetaEnv {
    readonly PUBLIC_API_BASE_URL: string;
    readonly PUBLIC_CDN_BASE: string;
    readonly PUBLIC_NODE_ENV: string;
    readonly PUBLIC_SENTRY_DSN: string;
    readonly PUBLIC_SITE_BASE_URL: string;
    readonly PUBLIC_TAG_NAME: string;
    readonly SENTRY_DSN?: string;
    readonly SENTRY_AUTH_TOKEN?: string;
    readonly SENTRY_ORG?: string;
    readonly SENTRY_PROJECT?: string;
    readonly SKIP_SENTRY?: string;
    readonly NODE_ENV?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
