import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy so the console reaches loms-api. Override the target with
// LOMS_API_TARGET (e.g. http://localhost:8100) when running locally.
const apiTarget = process.env.LOMS_API_TARGET || 'http://localhost:8100';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
});
