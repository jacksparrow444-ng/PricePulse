import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Chunk splitting — vendor libs in separate files → better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'motion':        ['framer-motion'],
          'charts':        ['recharts'],
          'pdf':           ['jspdf', 'jspdf-autotable'],
          'utils':         ['axios', 'react-hot-toast'],
        },
      },
    },
    // Warn if any chunk > 400KB
    chunkSizeWarningLimit: 400,
    // Minify
    minify: 'esbuild',
    target: 'esnext',
    // Remove console.log in production
    esbuildOptions: {
      drop: ['console', 'debugger'],
    },
  },

  // Pre-bundle optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'recharts', 'axios'],
  },
})
