import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress', // or 'gzip'
      ext: '.br',                  // or '.gz'
      threshold: 10240,            // Only compress files > 10KB
    }),
     // Optional: Brotli
    viteCompression({
      algorithm: 'gzip', // or 'brotliCompress'
      ext: '.gz',        // or '.br'
      threshold: 10240,  // Compress assets > 10kb
    })
  ],
  server: {
    port: 3000, // Change the port if needed
    host: '0.0.0.0', // Allow access from all IP addresses
    strictPort: true, // Exit if the port is already in use
  },
  
  logLevel: 'info', // Set the log level to info
  build: {
    minify: 'esbuild',
    rollupOptions: {
      treeshake: true,
    },
  }

});


  
