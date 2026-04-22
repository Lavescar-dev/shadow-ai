import { defineConfig } from 'vite';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { staticAdapter } from '@builder.io/qwik-city/adapters/static/vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => {
  return {
    build: isSsrBuild
      ? {
          rollupOptions: {
            input: ['src/entry.ssr.tsx', '@qwik-city-plan'],
          },
        }
      : undefined,
    server: {
      hmr: {
        overlay: false,
      },
    },
    optimizeDeps: {
      include: [
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/lang-javascript',
        '@codemirror/lang-css',
        '@codemirror/lang-html',
        '@codemirror/autocomplete',
        '@codemirror/theme-one-dark',
      ],
    },
    plugins: [
      tailwindcss(),
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
      staticAdapter({
        origin: process.env.PUBLIC_ORIGIN ?? 'https://nexus-ai.pages.dev',
      }),
    ],
  };
});
