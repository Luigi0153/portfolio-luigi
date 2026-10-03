/*
  Verifica dell'attributo `hidden` sulle varianti dell'hero. Le righe, i
  bottoni e la prova marcati con data-only vivono tutti nel markup; quelle
  del percorso non attivo devono avere `hidden` (e sparire davvero), quelle
  attive no. Si controlla:
  - all'avvio, senza scelta salvata (parte "dev") e con "business" salvato;
  - dopo ogni cambio di percorso col click sullo switch (dev, business, dev,
    business);
  - dopo una navigazione interna con le View Transitions e il ritorno in home.
  A 390 e 1280.
  Uso: node scripts/test-hero-hidden.mjs   (server attivo su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const VIEWPORT = [390, 1280];

const browser = await chromium.launch();
const falliti = [];
let controlli = 0;

/** Stato di ogni [data-only] dell'hero, più il percorso scritto su <html>. */
const leggi = (page) =>
  page.evaluate(() => ({
    percorso: document.documentElement.dataset.target,
    elementi: [...document.querySelectorAll(".hero [data-only]")].map((el) => ({
      solo: el.dataset.only,
      testo: el.textContent.replace(/\s+/g, " ").trim().slice(0, 40),
      hidden: el.hidden,
      display: getComputedStyle(el).display,
    })),
  }));

/** Attesa breve: l'osservatore su data-target aggiorna `hidden` subito dopo il click. */
const verifica = async (page, etichetta, atteso) => {
  await page.waitForTimeout(400);
  const s = await leggi(page);
  controlli += 1;
  const problemi = [];
  if (s.percorso !== atteso) problemi.push(`html[data-target] è "${s.percorso}", atteso "${atteso}"`);
  const attivi = s.elementi.filter((e) => e.solo === atteso);
  const spenti = s.elementi.filter((e) => e.solo !== atteso);
  if (attivi.length === 0 || spenti.length === 0) {
    problemi.push(`servono elementi di entrambi i percorsi (attivi ${attivi.length}, spenti ${spenti.length})`);
  }
  for (const e of attivi) {
    if (e.hidden) problemi.push(`attivo con hidden: "${e.testo}"`);
    if (e.display === "none") problemi.push(`attivo ma display:none: "${e.testo}"`);
  }
  for (const e of spenti) {
    if (!e.hidden) problemi.push(`non attivo senza hidden: "${e.testo}"`);
    if (e.display !== "none") problemi.push(`non attivo ma visibile: "${e.testo}"`);
  }
  if (problemi.length) falliti.push({ etichetta, problemi });
  console.log(
    `${problemi.length ? "KO" : "ok"}  ${etichetta}  (attivi ${attivi.length}, spenti ${spenti.length})`,
  );
};

const nuovaPagina = async (width, salvato) => {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  if (salvato) {
    await context.addInitScript((t) => {
      try {
        localStorage.setItem("target", t);
      } catch {}
    }, salvato);
  }
  const page = await context.newPage();
  const errori = [];
  page.on("pageerror", (err) => errori.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errori.push(msg.text());
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  return { context, page, errori };
};

const clicca = (page, nome) => page.getByRole("button", { name: nome }).click();

for (const w of VIEWPORT) {
  // Avvio senza scelta salvata: parte "dev", poi quattro cambi di percorso
  {
    const { context, page, errori } = await nuovaPagina(w, null);
    await verifica(page, `${w} avvio, nessuna scelta`, "dev");
    await clicca(page, "Vuoi vendere online");
    await verifica(page, `${w} click su business`, "business");
    await clicca(page, "Cerchi uno sviluppatore");
    await verifica(page, `${w} click su dev`, "dev");
    await clicca(page, "Vuoi vendere online");
    await verifica(page, `${w} click su business, di nuovo`, "business");

    // Navigazione interna (View Transitions) e ritorno: il percorso resta business
    await page.locator('.site-nav a[href="/come-lavoro"]').click();
    await page.waitForURL("**/come-lavoro");
    await page.locator(".site-nav__logo").click();
    await page.waitForURL(BASE + "/");
    await page.waitForTimeout(800);
    await verifica(page, `${w} dopo navigazione interna e ritorno`, "business");

    controlli += 1;
    if (errori.length) falliti.push({ etichetta: `${w} errori in console`, problemi: errori });
    console.log(`${errori.length ? "KO" : "ok"}  ${w} nessun errore in console`);
    await context.close();
  }

  // Avvio con "business" già salvato
  {
    const { context, page } = await nuovaPagina(w, "business");
    await verifica(page, `${w} avvio con business salvato`, "business");
    await clicca(page, "Cerchi uno sviluppatore");
    await verifica(page, `${w} da business salvato a dev`, "dev");
    await context.close();
  }
}

await browser.close();

if (falliti.length) {
  console.log("\nProblemi:");
  console.log(JSON.stringify(falliti, null, 2));
}
const ok = falliti.length === 0;
console.log(
  ok
    ? `\nTutte le verifiche di hidden sull'hero passate (${controlli} controlli)`
    : `\nVerifiche di hidden sull'hero fallite (${falliti.length} su ${controlli})`,
);
process.exitCode = ok ? 0 : 1;
