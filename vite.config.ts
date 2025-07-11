import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = 'http://cinemate.ddns.net:8081';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: Object.fromEntries([
      '/api/v1/auth/login',
      '/api/v1/auth/logout',
      '/api/v1/roles',
      '/api/v1/users',
      '/api/v1/users/add',
      '/api/v1/actors/all',
      '/api/v1/actors',
      '/api/v1/genres/all',
      '/api/v1/genres',
      '/api/v1/warnings/all',
      '/api/v1/warnings',
      '/api/v1/content-types/all',
      '/api/v1/content-types',
      '/api/v1/admin/contents',
      '/appUsers',
      '/roles',
      '/userRoles',
    ].map((path) => [
      path,
      {
        target: backendTarget,
        changeOrigin: true,
      },
    ])),
  },
});
