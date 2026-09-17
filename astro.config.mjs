// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` is required for the sitemap and for absolute OG/canonical URLs.
// It is the production domain from the design doc §1; change it here and
// nowhere else if the domain ever moves.
export default defineConfig({
  site: 'https://shrutinani.com',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  // The pages themselves live at src/pages/purpose.astro and timeline.astro —
  // these just carry anyone who bookmarked or linked the original /bio and
  // /resume URLs (used briefly right after launch) forward to the new ones.
  redirects: {
    '/bio': '/purpose',
    '/resume': '/timeline',
  },
});
