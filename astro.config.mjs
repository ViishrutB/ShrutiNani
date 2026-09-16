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
});
