import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // No source maps in production — keeps minified code unreadable
    sourcemap: false,

    // Aggressive minification: mangles variable names, strips comments
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // removes console.log() calls
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        toplevel: true,       // renames top-level functions/vars
      },
      format: {
        comments: false,      // strips all comments
      },
    },
  },
})