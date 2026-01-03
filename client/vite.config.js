import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  esbuild: {
    jsx: 'automatic'
  },
  server: {
    host: "0.0.0.0",
    port: 4000
  },
});
