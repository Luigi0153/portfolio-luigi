# Portfolio di Luigi

Portfolio personale di Luigi — Shopify Web Developer e AI Web Designer.
Sito statico in italiano, con uno switch nell'hero che riordina i contenuti per
due pubblici: chi cerca uno sviluppatore e chi vuole vendere online.

## Stack

| Cosa | Con che cosa |
| :--- | :--- |
| Framework | [Astro 7](https://astro.build) (statico) |
| Stili | Tailwind CSS v4, token in `src/styles/tokens.css` |
| Isole interattive | React 19 (solo switch target e slider prima/dopo) |
| Animazioni | GSAP + ScrollTrigger + SplitText |
| Contenuti | Content collection `progetti` (markdown + frontmatter) |
| Deploy | Vercel |

## Comandi

Tutti dalla radice del progetto.

| Comando | Cosa fa |
| :--- | :--- |
| `npm install` | Installa le dipendenze |
| `npm run dev` | Server di sviluppo (demone, vedi sotto) |
| `npm run build` | Build di produzione in `dist/` |
| `npm run preview` | Serve la build (demone, vedi sotto) |

### I demoni di Astro 7

`astro dev` e `astro preview` non restano in primo piano: il comando esce
subito e stampa porta e pid.

```sh
npx astro dev              # avvia
npx astro dev status       # porta e pid
npx astro dev logs         # log
npx astro dev stop         # ferma
```

Stessa cosa con `npx astro preview`. Dopo ogni `npm install`, o dopo aver
aggiunto un'isola React, riavvia il demone di dev.

Se un'isola non si idrata ma la build è pulita (tipo `_jsxDEV is not a
function`): ferma il demone, cancella `node_modules/.vite`, riavvia. Non
toccare la configurazione JSX.

## Script di supporto

Girano con Node, richiedono il server attivo quelli che aprono un browser.
`BASE_URL` punta al server (default `http://localhost:4321`; il preview di
solito apre sulla 4322).

| Script | Cosa fa |
| :--- | :--- |
| `node scripts/prepara-cover.mjs` | Rigenera le cover dei progetti (SVG → PNG con sharp) |
| `node scripts/prepara-scena.mjs` | Rigenera gli oggetti della scena scrivania |
| `node scripts/prepara-og.mjs` | Rigenera le og-image 1200×630 in `public/og/` |
| `node scripts/screenshot.mjs /percorso` | Screenshot a 390/768/1280 per entrambi i target |
| `node scripts/test-switch.mjs` | Verifica lo switch del target |
| `node scripts/test-scena.mjs` | Verifica la scena scrivania |
| `node scripts/test-etichette.mjs` | Verifica le etichette degli hotspot |
| `node scripts/test-progetti.mjs` | Verifica griglia, case study, slider, view transitions |

Esempio completo:

```sh
npm run build
npx astro preview                                  # stampa la porta, es. 4322
BASE_URL=http://localhost:4322 node scripts/test-progetti.mjs
BASE_URL=http://localhost:4322 node scripts/screenshot.mjs /contatti
npx astro preview stop
```

> Su Windows con Git Bash, gli script che prendono un percorso come argomento
> vogliono `MSYS_NO_PATHCONV=1` davanti, altrimenti `/contatti` viene tradotto
> in un percorso Windows.

## Struttura

```text
src/
├── assets/          immagini sorgente (le ottimizza <Image> di Astro)
├── components/
│   ├── sections/    Hero, DeskScene, ProjectGrid
│   └── ui/          Button, Card, Tag, Nav, StatTile, BeforeAfter, ...
├── content/
│   └── progetti/    i case study in markdown
├── layouts/
│   └── Base.astro   head, meta, og, nav, footer, skip link
├── pages/           index, come-lavoro, contatti, 404, robots.txt, progetti/[slug]
├── styles/
│   ├── tokens.css   i design token (fonte: docs/design-tokens.md)
│   └── global.css   base, utility, switch del target
└── dati-sito.ts     email, social, id Formspree
docs/
├── design-tokens.md il sistema visivo: si cambia qui, poi nel CSS
├── STATO.md         a che punto è il progetto
└── content/         i dati reali dei case study
```

## Prima del deploy

Tre cose sono segnaposto e vanno compilate:

1. `astro.config.mjs` → `site`: il dominio vero (serve a canonical, og:url e sitemap).
2. `src/dati-sito.ts` → `LINKEDIN`, `GITHUB`: i profili veri.
3. `src/dati-sito.ts` → `FORMSPREE_ID`: l'id del form da [formspree.io](https://formspree.io).
   Finché resta il segnaposto, la pagina contatti lo dichiara e rimanda all'email.

Dopo aver cambiato `site`, rilancia `npm run build` (robots e sitemap lo leggono).

## Convenzioni

- I colori si prendono **solo** dai token. Mai un hex nel CSS dei componenti.
- Mobile-first: si progetta a 390, poi 768, poi 1280.
- `prefers-reduced-motion` spegne GSAP: ogni animazione sta dentro un
  `gsap.matchMedia()`.
- Commit piccoli, messaggi in italiano: `feat(hero): switch target`.
