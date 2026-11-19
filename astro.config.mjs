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

  // Una sola forma degli URL, senza barra finale: è quella dei link interni e
  // quella che Google ha scelto. Canonical, og:url e sitemap la seguono; la
  // forma con la barra la reindirizza Vercel (vedi `trailingSlash` in vercel.json).
  trailingSlash: 'never',

  // Gli indirizzi vecchi del caso reale, prima che avesse il nome vero
  // (2026-11-18). Su Vercel risponde il 308 di vercel.json; qui la build
  // scrive una pagina di reindirizzamento, che vale per la preview.
  redirects: {
    '/progetti/caso-reale': '/progetti/sisters-store',
    '/loghi/boutique': '/loghi/sisters-store',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      // La styleguide è uno strumento di lavoro, non una pagina del sito.
      // Gli indirizzi vecchi reindirizzano: fuori dalla sitemap.
      filter: (page) =>
        !page.includes('/styleguide') &&
        !page.endsWith('/progetti/caso-reale') &&
        !page.endsWith('/loghi/boutique'),
    }),
  ]
});
