// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// DA COMPILARE prima del deploy: il dominio vero.
// Vercel assegna <nome-progetto>.vercel.app finché non colleghi un dominio tuo.
// Serve assoluto e con https: da qui escono canonical, og:url e la sitemap.
const site = 'https://luigi-portfolio.vercel.app';

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
