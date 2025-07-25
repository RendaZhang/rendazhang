// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_BASE_URL, API_BASE_URL } from './src/config.js';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  // Your existing config (e.g., integrations for React)
  vite: {
    server: {
      proxy: {
        // Proxy API requests in development
        [API_BASE_URL]: {
          target: SITE_BASE_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(new RegExp(`^${API_BASE_URL}`), API_BASE_URL)
        }
      }
    }
  }
});
