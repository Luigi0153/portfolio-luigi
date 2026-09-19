// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Dominio provvisorio: Vercel assegna <nome-progetto>.vercel.app al primo
// import, e se il nome che assegna e' diverso va corretto qui e ricostruito
// (canonical, og:url, sitemap e robots leggono tutti da qui).
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
