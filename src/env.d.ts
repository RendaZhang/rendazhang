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
