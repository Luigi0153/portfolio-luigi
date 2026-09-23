/*
  Genera le og-image 1200x630 (home, pagine principali, ogni progetto).

  Template SVG unico con i soli colori dei token. Il rendering NON passa da
  sharp/librsvg come prepara-cover.mjs: lì il testo era vietato proprio perché
  librsvg non ha i font del sito. Qui il testo serve, quindi l'SVG lo disegna
  Chromium via Playwright (già in devDependencies), con i woff2 di @fontsource
  incorporati in base64: stessi font del sito, nessuna dipendenza nuova.
  Il PNG finale passa comunque da sharp per la compressione in palette.

  Uso: node scripts/prepara-og.mjs   (rilanciare se cambiano titoli o palette)
       node scripts/prepara-og.mjs og.png og/contatti.png   (solo quelle)
  Output: public/og.png e public/og/<slug>.png
*/
import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const W = 1200;
const H = 630;

const T = {
  cream: "#fdf4e4",
  cream2: "#f6e9d2",
  ink: "#1a1a1a",
  ink2: "#4a4540",
  arancio: "#c93c00",
};

/* --- Font incorporati: gli stessi file che il sito serve in produzione --- */
const FONT = {
  display: "src/assets/fonts/fraunces-latin-72-50.woff2",
  sans: "node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2",
  mono: "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
};

const base64 = async (file) => (await readFile(file)).toString("base64");

const fonts = {
  display: await base64(FONT.display),
  sans: await base64(FONT.sans),
  mono: await base64(FONT.mono),
};

/**
 * Le pagine da generare. `file` è il percorso sotto public/.
 * Le forme non distinguono più il percorso per colore (un solo accento,
 * la regola 60/30/10 non lascia spazio a un secondo codice colore).
 */
const PAGINE = [
  {
    file: "og.png",
    etichetta: "Web Developer e AI Web Designer",
    titolo: "Ciao, sono Luigi.",
    sottotitolo: "Creo e seguo siti e negozi online.",
  },
  {
    file: "og/come-lavoro.png",
    etichetta: "Il metodo",
    titolo: "Come lavoro",
    sottotitolo: "Ascolto, numeri, prototipo, codice. In quest'ordine.",
  },
  {
    file: "og/contatti.png",
    etichetta: "Contatti",
    titolo: "Discutiamone insieme.",
    sottotitolo:
      "Cerchi uno sviluppatore per il tuo team o per creare e gestire il tuo sito? Contattami.",
  },
  {
    file: "og/caso-reale.png",
    etichetta: "Progetto · Lente: decisione",
    titolo: "I numeri prima, il sito dopo.",
    sottotitolo: "+63% ordini, +86% fatturato, stesso store.",
  },
  {
    file: "og/fornace-vietri.png",
    etichetta: "Progetto · In arrivo",
    titolo: "Fornace Vietri",
    sottotitolo: "Concept Shopify per una ceramica artigiana.",
  },
  {
    file: "og/pizzeria.png",
    etichetta: "Progetto · In arrivo",
    titolo: "Landing per una pizzeria",
    sottotitolo: "Una pagina sola, un obiettivo solo.",
  },
];

/**
 * Template SVG. Il testo sta in foreignObject: l'SVG puro non manda a capo,
 * e i titoli lunghi devono poterlo fare. Le forme restano SVG vero.
 */
const template = ({ etichetta, titolo, sottotitolo }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face {
        font-family: "Fraunces OG";
        src: url(data:font/woff2;base64,${fonts.display}) format("woff2");
        font-weight: 500 700;
      }
      @font-face {
        font-family: "Hanken OG";
        src: url(data:font/woff2;base64,${fonts.sans}) format("woff2");
        font-weight: 600;
      }
      @font-face {
        font-family: "Mono OG";
        src: url(data:font/woff2;base64,${fonts.mono}) format("woff2");
        font-weight: 400;
      }
      .og-eyebrow {
        font-family: "Mono OG", monospace;
        font-size: 24px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${T.ink2};
      }
      .og-titolo {
        font-family: "Fraunces OG", Georgia, serif;
        font-variation-settings: "opsz" 72, "SOFT" 50;
        font-weight: 700;
        font-size: 82px;
        line-height: 1.08;
        letter-spacing: -0.02em;
        color: ${T.ink};
        margin: 26px 0 0;
        text-wrap: balance;
      }
      .og-titolo.lungo { font-size: 66px; }
      .og-sotto {
        font-family: "Hanken OG", system-ui, sans-serif;
        font-weight: 600;
        font-size: 30px;
        line-height: 1.45;
        color: ${T.ink2};
        margin: 26px 0 0;
      }
      .og-firma {
        font-family: "Mono OG", monospace;
        font-size: 22px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${T.ink};
      }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="${T.cream}"/>

  <!-- Forme Bauhaus: solo ink, più la barra in cima in arancio -->
  <circle cx="1118" cy="96" r="104" fill="${T.ink}"/>
  <path d="M1200 630 L1200 430 A200 200 0 0 0 1000 630 Z" fill="${T.ink}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${T.arancio}"/>
  <rect x="78" y="520" width="150" height="10" rx="5" fill="${T.ink}"/>

  <foreignObject x="78" y="96" width="900" height="380">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <div class="og-eyebrow">${etichetta}</div>
      <div class="og-titolo${titolo.length > 30 ? " lungo" : ""}">${titolo}</div>
      <div class="og-sotto">${sottotitolo}</div>
    </div>
  </foreignObject>

  <foreignObject x="78" y="556" width="700" height="50">
    <div xmlns="http://www.w3.org/1999/xhtml" class="og-firma">luigi · portfolio</div>
  </foreignObject>
</svg>`;

/* --- Rendering --- */
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
});

await mkdir("public/og", { recursive: true });

// Con dei file come argomenti rigenera solo quelli: le altre og, rifatte senza
// motivo, cambierebbero solo nell'antialiasing.
const scelte = process.argv.slice(2);
const daFare = scelte.length > 0 ? PAGINE.filter((p) => scelte.includes(p.file)) : PAGINE;

for (const pagina of daFare) {
  const svg = template(pagina);

  // L'SVG sta dentro una pagina HTML minima: serve solo ad azzerare i margini
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">
     <style>html,body{margin:0;padding:0;background:${T.cream}}</style>
     </head><body>${svg}</body></html>`,
    { waitUntil: "load" },
  );

  // I font sono base64 nel documento: nessuna rete, ma il decode non è istantaneo
  await page.evaluate(() => document.fonts.ready);

  const png = await page.screenshot({ type: "png" });

  const destinazione = path.join("public", pagina.file);
  await mkdir(path.dirname(destinazione), { recursive: true });

  // palette: i PNG a tinte piatte scendono da ~90 KB a ~25 KB senza perdite visibili
  const compresso = await sharp(png)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  await writeFile(destinazione, compresso);
  console.log(`ok ${pagina.file} (${Math.round(compresso.length / 1024)} KB)`);
}

await browser.close();
