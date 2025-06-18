import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true
  },
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['framer-motion', 'react-icons'],
          editor: ['@uiw/react-codemirror', '@codemirror/lang-javascript'],
          router: ['react-router-dom'],
          redux: ['react-redux', 'redux']
        }
      }
    }
  }
})