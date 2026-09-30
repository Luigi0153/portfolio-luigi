/*
  Verifica di cosa cambia in home tra i due percorsi, a 390 e 1280:
  - hero: nel percorso dev il primary "Vedi il codice" porta al repository su
    GitHub in una nuova scheda, con l'icona e l'avviso per gli screen reader;
    nel percorso business "Vedi i risultati" porta alla griglia;
  - "Cosa faccio per te": solo nel percorso business, dopo la griglia
    progetti: apertura in Fraunces, quattro righe numerate tra linee sottili
    ink con la piastrella Bauhaus che cresce (SVG: un pezzo alla riga 1, tutta alla
    riga 4, l'ultimo pezzo arancio), righe impilate a 390 e
    affiancate a 1280, blocco di chiusura ink con testo cream e bottone
    arancio verso i contatti;
  - senza JavaScript vale il percorso dev;
  - nessun overflow, nessun errore in console.
  Uso: node scripts/test-percorsi.mjs   (server su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const REPO = "https://github.com/Luigi0153/portfolio-luigi";
const APERTURA =
  "Creo negozi online e siti per le attività: su Shopify, su WordPress o con altri strumenti, in base a quello che ti serve.";
const SERVIZI = [
  ["Negozio online su Shopify", "Dalla scelta del tema alle prime vendite."],
  ["Landing page", "Una pagina sola, pensata per un prodotto, un evento o una promozione."],
  ["Siti su WordPress e altri strumenti", "Scelgo lo strumento più adatto alla tua attività e al tuo budget."],
  ["Logo e immagine del negozio", "Colori, font e logo che si riconoscono, dal sito alle buste per le spedizioni."],
];
const CHIUSURA = "Il sito è tuo, e io resto al tuo fianco.";
/* Colori dei token in rgb, come li restituisce getComputedStyle. */
const INK = "rgb(26, 26, 26)";
const CREAM = "rgb(253, 244, 228)";
const ARANCIO = "rgb(201, 60, 0)";

const browser = await chromium.launch();
let fallimenti = 0;

const ok = (msg) => console.log(`✓ ${msg}`);
const ko = (msg) => {
  fallimenti++;
  console.error(`✗ ${msg}`);
};
const atteso = (cond, msg) => (cond ? ok(msg) : ko(msg));

/** Stato della home come lo vede l'utente: solo gli elementi visibili. */
const leggiHome = (page) =>
  page.evaluate(() => {
    const visibile = (el) => Boolean(el) && el.getClientRects().length > 0;
    const primary = [...document.querySelectorAll(".hero__cta .btn--primary")].filter(visibile);
    const cta = [...document.querySelectorAll(".hero__cta .btn")].filter(visibile);
    const servizi = document.querySelector('section[aria-labelledby="servizi-titolo"]');
    const progetti = document.querySelector("#progetti");
    const loghi = document.querySelector('section[aria-labelledby="loghi-striscia-titolo"]');
    const segue = (a, b) =>
      Boolean(a && b) && Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    const p = primary[0];
    const icona = p?.querySelector("svg");
    return {
      primary: primary.map((b) => ({
        testo: b.querySelector(".btn__label").childNodes[0]?.textContent.trim(),
        href: b.getAttribute("href"),
        target: b.getAttribute("target"),
        rel: b.getAttribute("rel") ?? "",
        nomeAccessibile: b.textContent.replace(/\s+/g, " ").trim(),
      })),
      icona: icona
        ? { visibile: visibile(icona), nascosta: icona.getAttribute("aria-hidden") === "true" }
        : null,
      // Le due CTA sulla stessa riga (da 380 in su, vedi Hero.astro)
      ctaAffiancate:
        cta.length === 2 &&
        Math.abs(cta[0].getBoundingClientRect().top - cta[1].getBoundingClientRect().top) < 1,
      servizi: {
        visibile: visibile(servizi),
        eyebrow: servizi?.querySelector(".eyebrow")?.textContent.trim(),
        apertura: servizi?.querySelector("h2")?.textContent.replace(/\s+/g, " ").trim(),
        aperturaFont: servizi ? getComputedStyle(servizi.querySelector("h2")).fontFamily : "",
        voci: [...(servizi?.querySelectorAll("li") ?? [])].map((li) => [
          li.querySelector("h3")?.textContent.trim(),
          li.querySelector("p")?.textContent.trim(),
        ]),
        numeri: [...(servizi?.querySelectorAll(".servizi__numero") ?? [])].map((n) =>
          n.textContent.trim(),
        ),
        // Una figura SVG per riga: la stessa piastrella, un pezzo in più alla volta
        forme: [...(servizi?.querySelectorAll("li svg") ?? [])].map((svg) => {
          const box = svg.getBoundingClientRect();
          const li = svg.closest("li").getBoundingClientRect();
          const pezzi = [...svg.querySelectorAll("path")];
          return {
            nascosta: svg.getAttribute("aria-hidden") === "true",
            visibile: visibile(svg),
            larghezza: box.width,
            altezza: box.height,
            // Posizione rispetto alla riga: uguale in tutte le righe
            sinistra: box.left - li.left,
            // Il pezzo appena aggiunto è l'ultimo, arancio; i precedenti ink
            fill: pezzi.map((pz) => pz.getAttribute("fill")),
            d: pezzi.map((pz) => pz.getAttribute("d")),
          };
        }),
        immagini: servizi?.querySelectorAll("li img").length ?? 0,
        // Righe divise da una linea sottile ink (1px), più quella in fondo
        linee: [...(servizi?.querySelectorAll("li") ?? [])].map((li) => {
          const c = getComputedStyle(li);
          return `${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor}`;
        }),
        lineaFondo: servizi
          ? (() => {
              const c = getComputedStyle(servizi.querySelector("ol"));
              return `${c.borderBottomWidth} ${c.borderBottomStyle} ${c.borderBottomColor}`;
            })()
          : "",
        // Impilate o affiancate: dove sta il testo rispetto al titolo
        impilate: [...(servizi?.querySelectorAll("li") ?? [])].every((li) => {
          const t = li.querySelector("h3").getBoundingClientRect();
          const p = li.querySelector("p").getBoundingClientRect();
          return p.top >= t.bottom - 1;
        }),
        affiancate: [...(servizi?.querySelectorAll("li") ?? [])].every((li) => {
          const t = li.querySelector("h3").getBoundingClientRect();
          const p = li.querySelector("p").getBoundingClientRect();
          return p.left >= t.right - 1 && p.top < t.bottom && t.top < p.bottom;
        }),
        // Una riga sotto l'altra, tutte lunghe quanto la lista
        unaPerRiga: [...(servizi?.querySelectorAll("li") ?? [])].every((li, i, tutte) => {
          if (i === 0) return true;
          return li.getBoundingClientRect().top >= tutte[i - 1].getBoundingClientRect().bottom - 1;
        }),
        lineeUguali: [...(servizi?.querySelectorAll("li") ?? [])].every(
          (li) =>
            Math.abs(li.getBoundingClientRect().width - li.parentElement.getBoundingClientRect().width) < 1,
        ),
        chiusura: (() => {
          const blocco = servizi?.querySelector(".servizi__chiusura");
          if (!blocco) return null;
          const btn = blocco.querySelector("a.btn");
          const cb = getComputedStyle(blocco);
          const cf = getComputedStyle(blocco.querySelector("p"));
          const bb = btn ? getComputedStyle(btn) : null;
          return {
            fondo: cb.backgroundColor,
            testo: cf.color,
            frase: blocco.querySelector("p").textContent.trim(),
            fraunces: /Fraunces/.test(cf.fontFamily),
            bottone: btn?.textContent.trim(),
            href: btn?.getAttribute("href"),
            fondoBottone: bb?.backgroundColor,
            testoBottone: bb?.color,
            dopoLista:
              blocco.getBoundingClientRect().top >= servizi.querySelector("ol").getBoundingClientRect().bottom,
          };
        })(),
        dopoProgetti: segue(progetti, servizi) && segue(servizi, loghi),
      },
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });

for (const vp of [390, 1280]) {
  for (const target of ["dev", "business"]) {
    const context = await browser.newContext({ viewport: { width: vp, height: 900 } });
    await context.addInitScript((t) => localStorage.setItem("target", t), target);
    const page = await context.newPage();
    const errori = [];
    page.on("pageerror", (e) => errori.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errori.push(m.text()));
    await page.goto(BASE + "/", { waitUntil: "networkidle" });

    const h = await leggiHome(page);
    const [p] = h.primary;
    const etichetta = `${vp}px ${target}`;

    atteso(h.primary.length === 1, `${etichetta}: un solo bottone primary visibile nell'hero`);
    if (target === "dev") {
      atteso(
        p?.testo === "Vedi il codice" && p.href === REPO,
        `${etichetta}: "Vedi il codice" porta al repository (${p?.href})`,
      );
      atteso(
        p?.target === "_blank" && p.rel.includes("noopener"),
        `${etichetta}: si apre in una nuova scheda, con rel noopener`,
      );
      atteso(
        h.icona?.visibile && h.icona.nascosta,
        `${etichetta}: icona del link esterno visibile e aria-hidden`,
      );
      atteso(
        p?.nomeAccessibile.includes("si apre in una nuova scheda"),
        `${etichetta}: lo screen reader sente che si apre una nuova scheda`,
      );
      atteso(!h.servizi.visibile, `${etichetta}: "Cosa faccio per te" non c'è`);
    } else {
      atteso(
        p?.testo === "Vedi i risultati" && p.href === "#progetti" && !p.target,
        `${etichetta}: "Vedi i risultati" porta alla griglia, stessa scheda`,
      );
      atteso(
        h.servizi.visibile && h.servizi.eyebrow === "Cosa faccio per te",
        `${etichetta}: "Cosa faccio per te" è visibile`,
      );
      atteso(h.servizi.dopoProgetti, `${etichetta}: la sezione sta tra la griglia progetti e i loghi`);
      atteso(
        h.servizi.apertura === APERTURA && /Fraunces/.test(h.servizi.aperturaFont),
        `${etichetta}: apertura scritta giusta e in Fraunces`,
      );
      atteso(
        h.servizi.voci.map((v) => v.join(" / ")).join("|") ===
          SERVIZI.map((v) => v.join(" / ")).join("|"),
        `${etichetta}: i quattro servizi, nell'ordine`,
      );
      atteso(h.servizi.numeri.join() === "01,02,03,04", `${etichetta}: righe numerate 01-04`);
      atteso(
        h.servizi.forme.length === 4 &&
          h.servizi.immagini === 0 &&
          h.servizi.forme.every((f) => f.nascosta && f.visibile),
        `${etichetta}: quattro figure SVG decorative, senza immagini`,
      );
      atteso(
        h.servizi.forme.every(
          (f, i) =>
            f.d.length === i + 1 &&
            f.fill.at(-1) === "var(--color-arancio)" &&
            f.fill.slice(0, -1).every((c) => c === "var(--color-ink)"),
        ),
        `${etichetta}: la riga n ha n pezzi, l'ultimo arancio e i precedenti ink`,
      );
      atteso(
        h.servizi.forme.every(
          (f, i, tutte) =>
            i === 0 || tutte[i - 1].d.every((d, k) => d === f.d[k]),
        ),
        `${etichetta}: ogni figura contiene i pezzi della precedente, negli stessi punti`,
      );
      atteso(
        h.servizi.forme.every(
          (f, i, tutte) =>
            f.larghezza === tutte[0].larghezza &&
            f.altezza === tutte[0].altezza &&
            Math.abs(f.sinistra - tutte[0].sinistra) < 0.5,
        ),
        `${etichetta}: stessa dimensione e posizione della figura in ogni riga`,
      );
      atteso(
        h.servizi.linee.every((l) => l === `1px solid ${INK}`) &&
          h.servizi.lineaFondo === `1px solid ${INK}`,
        `${etichetta}: righe divise da una linea sottile ink`,
      );
      atteso(
        h.servizi.unaPerRiga && h.servizi.lineeUguali,
        `${etichetta}: una riga sotto l'altra, linee lunghe uguali`,
      );
      atteso(
        vp < 768 ? h.servizi.impilate : h.servizi.affiancate,
        `${etichetta}: ${vp < 768 ? "titolo e testo impilati su telefono" : "titolo e testo affiancati su desktop"}`,
      );
      const ch = h.servizi.chiusura;
      atteso(
        ch?.frase === CHIUSURA && ch.fraunces && ch.dopoLista,
        `${etichetta}: chiusura "${ch?.frase}" in Fraunces, dopo le righe`,
      );
      atteso(
        ch?.fondo === INK && ch.testo === CREAM,
        `${etichetta}: blocco di chiusura pieno ink con testo cream`,
      );
      atteso(
        ch?.bottone === "Contattami" &&
          ch.href === "/contatti" &&
          ch.fondoBottone === ARANCIO &&
          ch.testoBottone === CREAM,
        `${etichetta}: bottone di contatto arancio nel blocco (${ch?.bottone})`,
      );
    }
    atteso(h.ctaAffiancate, `${etichetta}: le due CTA dell'hero restano sulla stessa riga`);
    atteso(!h.overflow, `${etichetta}: nessun overflow orizzontale`);
    atteso(errori.length === 0, `${etichetta}: nessun errore in console`);
    if (errori.length) console.error("   ", errori.slice(0, 3));
    await context.close();
  }
}

/* Senza JavaScript: niente data-target, vale il percorso dev */
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  const h = await leggiHome(page);
  atteso(
    h.primary.length === 1 && h.primary[0].href === REPO && !h.servizi.visibile,
    "senza JavaScript: percorso dev, bottone al repository, niente servizi",
  );
  await context.close();
}

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche dei percorsi passate");
}
