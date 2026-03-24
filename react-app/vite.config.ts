import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['motion', 'lucide-react'],
          ai: ['@google/genai']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  preview: {
    port: 4173,
  },
});
