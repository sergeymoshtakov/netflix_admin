import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = 'http://cinemate.ddns.net:8081';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/appUsers': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/roles': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/userRoles': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/episodes': {
        target: backendTarget,
        changeOrigin: true,
      },
    },
  },
});
