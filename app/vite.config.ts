import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    publicDir: '../public',
    server: {
      port: 5174,
      proxy: {
        '/api': env.VITE_CORE_PROXY_TARGET || 'http://127.0.0.1:8000'
      }
    },
    preview: {
      port: 4174
    }
  }
})
