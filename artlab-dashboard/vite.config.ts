import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const target = process.env.VITE_API_URL || 'http://localhost:8000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/health': { target, changeOrigin: true },
      '/system': { target, changeOrigin: true },
      '/models': { target, changeOrigin: true },
      '/chat': { target, changeOrigin: true },
      '/generate': { target, changeOrigin: true },
      '/build_prompt': { target, changeOrigin: true },
      '/logs': { target, changeOrigin: true },
      '/sync': { target, changeOrigin: true, ws: true },
    },
  },
})
