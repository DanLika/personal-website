import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable sourcemaps for smaller builds
    sourcemap: false,
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk for React ecosystem
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // i18n
          if (id.includes('node_modules/i18next') ||
              id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          // Lucide icons - separate chunk
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Markdown - separate chunk (lazy loaded pages)
          if (id.includes('node_modules/react-markdown') ||
              id.includes('node_modules/remark-gfm')) {
            return 'vendor-markdown';
          }
          // OGL - WebGL library
          if (id.includes('node_modules/ogl')) {
            return 'vendor-ogl';
          }
        },
      },
    },
    // Increase chunk size warning limit slightly
    chunkSizeWarningLimit: 600,
    // Enable minification (esbuild is default, very fast)
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'i18next', 'react-i18next', 'ogl'],
  },
})
