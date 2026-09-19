import type { APIRoute } from "astro";

/**
 * robots.txt come endpoint e non come file in public/: così l'URL della
 * sitemap segue `site` di astro.config e non resta indietro quando cambia
 * il dominio. In build statica viene compilato una volta in /robots.txt.
 *
 * /styleguide è escluso anche qui, oltre che dal filter della sitemap:
 * è uno strumento di lavoro, non una pagina del sito.
 */
export const GET = (({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site);

  const corpo = `User-agent: *
Allow: /
Disallow: /styleguide

Sitemap: ${sitemap.href}
`;

  return new Response(corpo, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}) satisfies APIRoute;
