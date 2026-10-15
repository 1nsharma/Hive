import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap']
  }
})
