import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static', // Hybrid mode: SSR for auth pages, pre-render for static pages
  adapter: cloudflare({
    mode: 'directory'
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false, // We'll use our own global.css
    }),
    vue(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});

