import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_URL || 'http://localhost:8000'

  return {
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
  }
})
