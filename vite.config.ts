import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** The landing page plus one static page per policy, so each has its own address. */
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy/index.html',
        terms: 'terms/index.html',
        cancellation: 'cancellation-policy/index.html',
      },
    },
  },
});
