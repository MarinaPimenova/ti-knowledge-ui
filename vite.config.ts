import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  base: '/dashboard-page',  // Set the base URL for the app
  optimizeDeps: {
    exclude: ['@tanstack/react-query'],
  },
  build: {
    minify: true,
    sourcemap: false,
    target: 'modules',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  }
});