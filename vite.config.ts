import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { validateProductionApiBaseUrl } from './scripts/validate-release-config.mjs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'production') {
    const environment = loadEnv(mode, process.cwd(), '');
    validateProductionApiBaseUrl(environment.VITE_API_BASE_URL);
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@app': path.resolve(__dirname, './src/app'),
        '@features': path.resolve(__dirname, './src/features'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/services'),
        '@store': path.resolve(__dirname, './src/store'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@theme': path.resolve(__dirname, './src/theme'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    server: {
      port: 3001,
    },
  };
});
