import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [],
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
  },
});
