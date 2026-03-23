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
    host: true,
    port: 4000,
    strictPort: false,
    cors: true,
  },
});
