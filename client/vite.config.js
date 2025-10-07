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
    allowedHosts: [
      "4f4fdb03abad.ngrok-free.app",
    ],
    port: 4000
  },
});
