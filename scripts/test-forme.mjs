/*
  Nessuna forma Bauhaus tocca il testo, su nessuna pagina, a 320, 390, 768,
  1024 e 1280, in entrambi i percorsi.

  Per ogni forma si calcola l'area che può occupare davvero, non solo quella
  del primo frame:
  - le forme che girano (data-spin) spazzano un disco largo quanto la loro
    diagonale;
  - quelle col parallax (data-parallax) salgono fino a N px rispetto al testo
    mentre l'hero scorre via;
  - i cerchi fermi contano come cerchi, il resto come rettangolo;
  - la parte tagliata dall'overflow della sezione non conta, perché non si vede.
  Le misure si prendono con prefers-reduced-motion, cioè senza trasformazioni
  di GSAP: rotazione e parallax li aggiunge il calcolo qui sopra.
  Il testo sono tutte le righe visibili della pagina, nav esclusa (è sticky e
  passa sopra a tutto mentre si scorre).
  Uso: node scripts/test-forme.mjs   (server su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
/* Distanza minima tra forma e riga di testo, in px */
const MARGINE = 8;

const browser = await chromium.launch();
let fallimenti = 0;

const ok = (msg) => console.log(`✓ ${msg}`);
const ko = (msg) => {
  fallimenti++;
  console.error(`✗ ${msg}`);
};

const pagine = [
  "/",
  "/come-lavoro",
  "/contatti",
  "/404",
  "/progetti/caso-reale",
  "/progetti/fornace-vietri",
  "/progetti/pizzeria",
  "/styleguide",
];

const viewport = [
  { w: 320, h: 568 },
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1280, h: 800 },
];

const FORME = [
  ".forma",
  ".nf__zero",
  'section[aria-labelledby="forme"] li > [aria-hidden="true"]',
].join(", ");

const misura = (page, selettore) =>
  page.evaluate((sel) => {
    const forme = [...document.querySelectorAll(sel)].filter(
      (el) => el.getClientRects().length > 0,
    );

    const ritaglio = (el) => {
      let r = { l: -Infinity, t: -Infinity, r: Infinity, b: Infinity };
      for (let p = el.parentElement; p; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (/(hidden|clip)/.test(cs.overflowX + cs.overflowY)) {
          const b = p.getBoundingClientRect();
          r = {
            l: Math.max(r.l, b.left),
            t: Math.max(r.t, b.top),
            r: Math.min(r.r, b.right),
            b: Math.min(r.b, b.bottom),
          };
        }
      }
      return r;
    };

    const righe = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const testo = n.textContent.trim();
      if (!testo) continue;
      const el = n.parentElement;
      if (!el || el.closest(".site-nav, script, style, noscript")) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
      range.selectNodeContents(n);
      for (const q of range.getClientRects()) {
        if (q.width < 2 || q.height < 2) continue;
        righe.push({ l: q.left, t: q.top, r: q.right, b: q.bottom, testo: testo.slice(0, 40) });
      }
    }

    const lista = forme.map((el) => {
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const gira = el.dataset.spin !== undefined;
      /*
        Il disco su cui è ritagliata la forma, dentro il suo box:
        - cerchio: centro nel mezzo, raggio metà lato;
        - semicerchio (angoli in alto tondi): centro a metà del lato basso;
        - quarto (un solo angolo tondo al 100%): centro nell'angolo opposto.
        La barra ha raggi piccoli e resta un rettangolo.
      */
      const raggi = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map((a) => {
        // "100%" resta in percentuale anche nel computed style
        const v = cs[`border${a}Radius`].split(" ")[0];
        const px = v.endsWith("%") ? (parseFloat(v) / 100) * b.width : parseFloat(v) || 0;
        return Math.min(px, Math.max(b.width, b.height));
      });
      const pieno = (v) => v >= Math.min(b.width, b.height) / 2 - 0.5;
      let disco = null;
      if (gira) {
        disco = {
          cx: b.left + b.width / 2,
          cy: b.top + b.height / 2,
          raggio: Math.hypot(b.width, b.height) / 2,
        };
      } else if (raggi.every(pieno) && Math.abs(b.width - b.height) < 0.5) {
        disco = { cx: b.left + b.width / 2, cy: b.top + b.height / 2, raggio: b.width / 2 };
      } else if (pieno(raggi[0]) && pieno(raggi[1]) && raggi[2] === 0 && raggi[3] === 0) {
        disco = { cx: b.left + b.width / 2, cy: b.bottom, raggio: b.width / 2 };
      } else if (raggi.filter((v) => v > 0).length === 1 && raggi.some((v) => v >= b.width - 0.5)) {
        const i = raggi.findIndex((v) => v > 0);
        const angoli = [
          [b.right, b.bottom],
          [b.left, b.bottom],
          [b.left, b.top],
          [b.right, b.top],
        ];
        disco = { cx: angoli[i][0], cy: angoli[i][1], raggio: b.width };
      }
      return {
        nome: el.className || el.parentElement.textContent.trim(),
        box: { l: b.left, t: b.top, r: b.right, b: b.bottom },
        disco,
        gira,
        parallax: Number(el.dataset.parallax ?? 0),
        ritaglio: ritaglio(el),
      };
    });
    return { forme: lista, righe };
  }, selettore);

/*
  Distanza tra l'area spazzata dalla forma e una riga di testo (negativa =
  sovrapposte). Il parallax sposta la forma in su fino a P px: si allunga
  l'area verso l'alto. Per le forme ritagliate da un disco dentro il box
  (quarto, semicerchio) vale la più grande delle due distanze: è un minimo
  garantito, quindi il controllo resta prudente.
*/
function distanzaBox(box, P, riga) {
  const sx = Math.max(box.l - riga.r, riga.l - box.r);
  const sy = Math.max(box.t - P - riga.b, riga.t - box.b);
  if (sx < 0 && sy < 0) return Math.max(sx, sy);
  return Math.hypot(Math.max(0, sx), Math.max(0, sy));
}

function distanzaDisco({ cx, cy, raggio }, P, riga) {
  const dx = Math.max(0, riga.l - cx, cx - riga.r);
  const dy = Math.max(0, riga.t - cy, cy - P - riga.b);
  return Math.hypot(dx, dy) - raggio;
}

function distanza(forma, riga) {
  const P = forma.parallax;
  if (forma.gira) return distanzaDisco(forma.disco, P, riga);
  const box = distanzaBox(forma.box, P, riga);
  return forma.disco ? Math.max(box, distanzaDisco(forma.disco, P, riga)) : box;
}

/* Solo la parte della riga dentro il ritaglio della forma: il resto non si vede */
function taglia(riga, c) {
  const r = {
    ...riga,
    l: Math.max(riga.l, c.l),
    t: Math.max(riga.t, c.t),
    r: Math.min(riga.r, c.r),
    b: Math.min(riga.b, c.b),
  };
  return r.r > r.l && r.b > r.t ? r : null;
}

for (const vp of viewport) {
  for (const target of ["dev", "business"]) {
    const context = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      reducedMotion: "reduce",
    });
    await context.addInitScript((t) => localStorage.setItem("target", t), target);
    const page = await context.newPage();

    for (const url of pagine) {
      await page.goto(BASE + url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      // Le etichette della scena si vedono al passaggio del mouse e sempre sui
      // touch: contano come testo anche quando a riposo sono nascoste.
      await page.addStyleTag({
        content: ".hotspot__label { opacity: 1 !important; visibility: visible !important; }",
      });

      const { forme, righe } = await misura(page, FORME);

      for (const forma of forme) {
        let peggiore = { d: Infinity, testo: "" };
        for (const riga of righe) {
          const visibile = taglia(riga, forma.ritaglio);
          if (!visibile) continue;
          const d = distanza(forma, visibile);
          if (d < peggiore.d) peggiore = { d, testo: riga.testo };
        }
        const etichetta = `${vp.w}px ${target} ${url} ${forma.nome}`;
        const d = peggiore.d === Infinity ? "nessun testo vicino" : `${peggiore.d.toFixed(1)}px da "${peggiore.testo}"`;
        if (peggiore.d >= MARGINE) ok(`${etichetta}: ${d}`);
        else ko(`${etichetta}: ${d}`);
      }
    }
    await context.close();
  }
}

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} forme troppo vicine al testo (margine ${MARGINE}px)`);
  process.exitCode = 1;
} else {
  console.log(`\nNessuna forma tocca il testo (margine ${MARGINE}px)`);
}
