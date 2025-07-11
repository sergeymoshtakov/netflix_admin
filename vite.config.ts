import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/auth/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/auth/logout': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/roles': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/users/add': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/actors/all': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/actors': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/genres/all': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/genres': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/warnings/all': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/warnings': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/content-types/all': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/content-types': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
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
      '/episodes': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
