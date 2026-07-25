import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/market': { target: 'http://localhost:8000', changeOrigin: true },
      '/analytics': { target: 'http://localhost:8000', changeOrigin: true },
      '/pump': { target: 'http://localhost:8000', changeOrigin: true },
      '/volume': { target: 'http://localhost:8000', changeOrigin: true },
      '/indicators': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
