/**
 * Parking Lot Simulator - Vite Configuration
 * 
 * Configuration for Vite build tool, enabling React and path aliases.
 * 
 * @version 0.1.0
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    http2: true,
  },
  build: {
    minify: 'terser',
  },
});
