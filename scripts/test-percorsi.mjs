/*
  Verifica di cosa cambia in home tra i due percorsi, a 390 e 1280:
  - hero: nel percorso dev il primary "Vedi il codice" porta al repository su
    GitHub in una nuova scheda, con l'icona e l'avviso per gli screen reader;
    nel percorso business "Vedi i risultati" porta alla griglia;
  - "Cosa faccio per te": solo nel percorso business, dopo la griglia
    progetti, cinque servizi uno per riga, senza icone, bottone ai contatti;
  - senza JavaScript vale il percorso dev;
  - nessun overflow, nessun errore in console.
  Uso: node scripts/test-percorsi.mjs   (server su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const REPO = "https://github.com/Luigi0153/portfolio-luigi";
const SERVIZI = [
  "Apro il tuo negozio su Shopify, dalla scelta del tema alle prime vendite.",
  "Carico e sistemo il catalogo: prodotti, foto, categorie, schede.",
  "Creo siti e landing page, anche su WordPress.",
  "Leggo i numeri del negozio e ti dico cosa cambiare prima di spendere.",
  "Resto al tuo fianco dopo il lancio, per aggiornamenti e modifiche.",
];

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
        titolo: servizi?.querySelector("h2")?.textContent.trim(),
        voci: [...(servizi?.querySelectorAll("li") ?? [])].map((li) => li.textContent.trim()),
        icone: servizi?.querySelectorAll("li svg, li img").length ?? 0,
        // Una voce per riga: nessuna voce accanto a un'altra
        unaPerRiga: [...(servizi?.querySelectorAll("li") ?? [])].every((li, i, tutte) => {
          if (i === 0) return true;
          return li.getBoundingClientRect().top >= tutte[i - 1].getBoundingClientRect().bottom - 1;
        }),
        // Le linee tra le righe lunghe quanto quella in fondo alla lista
        lineeUguali: [...(servizi?.querySelectorAll("li") ?? [])].every(
          (li) =>
            Math.abs(li.getBoundingClientRect().width - li.parentElement.getBoundingClientRect().width) < 1,
        ),
        bottone: [...(servizi?.querySelectorAll('a[href="/contatti"]') ?? [])]
          .filter(visibile)
          .map((a) => a.textContent.trim()),
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
        h.servizi.visibile && h.servizi.titolo === "Cosa faccio per te",
        `${etichetta}: "Cosa faccio per te" è visibile`,
      );
      atteso(h.servizi.dopoProgetti, `${etichetta}: la sezione sta tra la griglia progetti e i loghi`);
      atteso(
        h.servizi.voci.join("|") === SERVIZI.join("|"),
        `${etichetta}: i cinque servizi, nell'ordine`,
      );
      atteso(
        h.servizi.icone === 0 && h.servizi.unaPerRiga,
        `${etichetta}: un servizio per riga, senza icone`,
      );
      atteso(h.servizi.lineeUguali, `${etichetta}: le linee tra le righe sono lunghe uguali`);
      atteso(
        h.servizi.bottone.length === 1,
        `${etichetta}: sotto c'è il bottone per il contatto (${h.servizi.bottone[0]})`,
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
