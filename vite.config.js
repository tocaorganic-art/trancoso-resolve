import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const buildVersion = process.env.GITHUB_SHA
  || process.env.VERCEL_GIT_COMMIT_SHA
  || process.env.BASE44_DEPLOY_SHA
  || 'dev';

export default defineConfig({
  logLevel: 'error',
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion),
  },
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS !== 'false'
    }),
    react(),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
          ],
          'ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            'class-variance-authority',
          ],
          'analytics': [
            '@vercel/analytics',
            '@vercel/speed-insights',
          ],
          'maps': [
            'react-leaflet',
            'leaflet',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
  },
});