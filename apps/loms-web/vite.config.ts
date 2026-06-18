import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy so the console can reach loms-api when pages are wired to live data.
// Override with LOMS_API_TARGET (e.g. http://localhost:8100).
const apiTarget = process.env.LOMS_API_TARGET || 'http://localhost:8100';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
});
