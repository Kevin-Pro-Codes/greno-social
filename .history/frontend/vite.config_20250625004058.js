// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default {
  server: {
    host: '0.0.0.0', // Also serves on LAN
    proxy: {
      '/api': {
        target: 'http://192.168.1.6:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
};