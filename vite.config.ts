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
        secure: false,
      },
      '/appUsers': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/roles': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/userRoles': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/episodes': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
