import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  esbuild: {
    jsx: 'automatic',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'ai', '@ai-sdk/openai'],
  },
  server: {
    cors: true,
  },
});
