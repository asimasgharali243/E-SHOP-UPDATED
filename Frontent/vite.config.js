import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Change the port if needed
    host: '0.0.0.0', // Allow access from all IP addresses
    strictPort: true, // Exit if the port is already in use
  },
  
  logLevel: 'info', // Set the log level to info
});


  
