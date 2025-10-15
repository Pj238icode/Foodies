import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   base: './',

  // Optional: if using React Router in 'browser' mode
  build: {
    outDir: 'dist',
  },
})
