import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/genres': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/appUsers': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/contents': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/roles': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/contentTypes': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/actors': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/episodes': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/warnings': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
