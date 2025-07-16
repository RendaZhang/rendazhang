// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  // Your existing config (e.g., integrations for React)
  vite: {
    server: {
      proxy: {
        // Proxy all /cloudchat/* requests to the production backend
        '/cloudchat': {
          target: 'https://www.rendazhang.com',
          changeOrigin: true, // Rewrite host header to match target
          secure: true, // Allow HTTPS
          rewrite: (path) => path.replace(/^\/cloudchat/, '/cloudchat') // Keep the path intact
        }
      }
    }
  }
});
