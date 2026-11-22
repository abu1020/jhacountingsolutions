import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'url';
import path from 'path';
import {defineConfig} from 'vite';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(currentDir, '.'),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          // Separate long-lived vendor chunks for maximum CDN & browser cache hits
          // and keep Firebase strictly isolated so public visitors never download it.
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/firebase/') || id.includes('@firebase/')) {
                return 'firebase-vendor';
              }
              if (id.includes('/framer-motion/')) {
                return 'motion-vendor';
              }
              if (id.includes('/lucide-react/')) {
                return 'icons-vendor';
              }
              if (id.includes('/zod/')) {
                return 'validation-vendor';
              }
              if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
                return 'react-vendor';
              }
            }
            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Allow sandbox/preview hosts to reach the dev server (dev-only;
      // production is a static build served by Express/Vercel).
      allowedHosts: ['.e2b.app', 'localhost'],
    },
  };
});
