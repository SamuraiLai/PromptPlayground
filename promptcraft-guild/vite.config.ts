import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
  // This ensures that routes are handled correctly in development
  preview: {
    port: 5173,
    // Handle client-side routing
    host: true,
  },
  css: {
    devSourcemap: true,
  },
})
