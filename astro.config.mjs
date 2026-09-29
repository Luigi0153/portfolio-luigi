// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Dominio definitivo, senza www (www reindirizza qui da Vercel).
// Canonical, og:url, anteprime social, sitemap e robots leggono tutti da qui.
const site = 'https://luigiromano.cloud';

// https://astro.build/config
export default defineConfig({
  site,

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      // La styleguide è uno strumento di lavoro, non una pagina del sito.
      filter: (page) => !page.includes('/styleguide'),
    }),
  ]
});
