import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [preact()],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  /* MapLibre spawns an ES-module worker; without this Vite emits no worker
     chunk in the production build and the map silently renders blank. */
  worker: {
    format: 'es',
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    port: 5199,
  },
});
