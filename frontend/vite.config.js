import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    origin: "http://localhost:3000",
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
    origin: "http://localhost:3000",
  }
})
