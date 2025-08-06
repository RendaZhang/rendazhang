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
