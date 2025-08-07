import type { GLOBAL_CONFIG } from '../constants/settings';

/**
 * Global ambient type declarations.
 * Add custom declarations for third-party modules without TypeScript types.
 */

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.pdf' {
  const src: string;
  export default src;
}

declare global {
  interface Window {
    config: typeof GLOBAL_CONFIG;
  }
}

export {};
