import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
  ],
  optimizeDeps: {
    include: ['onnxruntime-web'],
    exclude: ['@imgly/background-removal'],
    
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      // 'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  logLevel: 'info',
  build: {
    minify: 'esbuild',
    rollupOptions: {
      treeshake: true,
    },
  }
});