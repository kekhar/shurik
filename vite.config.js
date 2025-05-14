// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // все запросы вида /api/* будут перенаправлены на наш бэкенд
      '/api': {
        target: 'https://api.tutor.donater.dev',
        changeOrigin: true,
        secure: true,
        // rewrite: путь остается как /api/v1/...
        rewrite: (path) => path,
      },
    },
  },
});
