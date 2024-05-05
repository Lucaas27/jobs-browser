import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      usePolling: true,
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
