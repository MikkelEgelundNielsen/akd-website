import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { createClient } from '@sanity/client';

const SITE = 'https://akddanmark.dk';

async function fetchSSRSlugs() {
  try {
    const client = createClient({
      projectId: 'tkm5yw5l',
      dataset: 'production',
      apiVersion: '2024-01-01',
      useCdn: true,
    });

    const [newsSlugs, articleSlugs] = await Promise.all([
      client.fetch(`*[_type == "newsArticle" && isPublic == true]{ "slug": slug.current }`),
      client.fetch(`*[_type == "article" && isPublic == true]{ "slug": slug.current }`),
    ]);

    return [
      ...newsSlugs.map((n) => `${SITE}/nyheder/${n.slug}`),
      ...articleSlugs.map((a) => `${SITE}/artikler/${a.slug}`),
    ];
  } catch (e) {
    console.warn('Sitemap: Could not fetch SSR slugs from Sanity:', e.message);
    return [];
  }
}

const ssrPages = await fetchSSRSlugs();

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: cloudflare({
    mode: 'directory'
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    vue(),
    sitemap({
      filter: (page) =>
        !page.includes('/andelshavere/') &&
        !page.includes('/api/'),
      customPages: [
        `${SITE}/andelshavere/andele`,
        ...ssrPages,
      ],
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});

