// frontend/vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // Tailwind v4 uses a Vite plugin — no tailwind.config.js needed
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // lets you import '@/components/...'
    },
  },
})