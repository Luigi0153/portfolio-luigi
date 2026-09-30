/*
  Verifica della sezione loghi a 390 (touch) e 1280:
  - /loghi carica, un solo h1, i riquadri e i filtri generati dagli stili;
  - i filtri filtrano con clic e da tastiera, con aria-pressed coerente;
  - senza JavaScript la barra dei filtri non c'è e si vede tutto;
  - nessuna etichetta "Progetto" visibile (card e dettaglio; solo gli altri
    tipi ne hanno una), nome sempre visibile su touch e al passaggio del
    mouse su desktop, alt con nome e tipo;
  - la frase di non affiliazione compare solo sotto rebranding ed esplorazioni,
    nel riquadro e nel dettaglio;
  - ogni dettaglio mostra solo i formati con immagini, tutte caricate;
  - home: striscia con il carosello (tutti i loghi, nell'ordine), link a /loghi,
    nav a tre voci con Loghi, footer (il movimento è in test-carosello);
  - nessun overflow orizzontale.
  Uso: node scripts/test-loghi.mjs   (server su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const NON_AFFILIATO =
  "Esercizio di stile. Non affiliato ai marchi citati, nessun uso commerciale.";
const TIPI_CON_FRASE = ["rebranding", "esplorazione"];
const ETICHETTE = {
  progetto: "Progetto",
  esercizio: "Esercizio",
  rebranding: "Rebranding",
  esplorazione: "Esplorazione",
};

const browser = await chromium.launch();
let fallimenti = 0;

const ok = (msg) => console.log(`✓ ${msg}`);
const ko = (msg) => {
  fallimenti++;
  console.error(`✗ ${msg}`);
};
const atteso = (cond, msg) => (cond ? ok(msg) : ko(msg));

/* 390 come un telefono vero: touch e niente hover, altrimenti Chromium
   risponde (hover: hover) anche a 390. */
const VIEWPORT = [
  { w: 390, h: 844, touch: true },
  { w: 1280, h: 800, touch: false },
];

const nuovaPagina = async (vp, opzioni = {}) => {
  const context = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    hasTouch: vp.touch,
    isMobile: vp.touch,
    ...opzioni,
  });
  const page = await context.newPage();
  const errori = [];
  page.on("pageerror", (e) => errori.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errori.push(m.text()));
  return { page, context, errori };
};

const senzaOverflow = (page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  );

/** Tutte le immagini caricate: lazy comprese, dopo averle portate in vista. */
const immaginiCaricate = async (page) => {
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll("main img")) {
      img.loading = "eager";
    }
    await Promise.all(
      [...document.querySelectorAll("main img")].map((img) =>
        img.complete
          ? null
          : new Promise((fine) => {
              img.addEventListener("load", fine, { once: true });
              img.addEventListener("error", fine, { once: true });
            }),
      ),
    );
  });
  return page.evaluate(() =>
    [...document.querySelectorAll("main img")].every((img) => img.naturalWidth > 0),
  );
};

/** Riquadri visibili, con i loro dati: stile, tipo, alt, frase. */
const leggiRiquadri = (page, radice = "main") =>
  page.evaluate((radice) => {
    return [...document.querySelectorAll(`${radice} [data-stile]`)].map((li) => {
      const tipo = li.querySelector(".logo__tipo");
      const nome = li.querySelector(".logo__nome");
      const card = li.querySelector("a");
      const rCard = card.getBoundingClientRect();
      const rNome = nome.getBoundingClientRect();
      return {
        visibile: li.getClientRects().length > 0,
        stile: li.dataset.stile,
        tipo: li.dataset.tipo,
        href: card.getAttribute("href"),
        etichetta: tipo?.textContent.trim() ?? null,
        tipoVisibile: Boolean(tipo) && tipo.getClientRects().length > 0 && getComputedStyle(tipo).visibility !== "hidden",
        parolaProgetto: /Progetto/i.test(li.textContent),
        nome: nome.textContent.trim(),
        // Il nome è visibile se sta dentro il riquadro, non sotto il clip.
        nomeVisibile: rNome.bottom <= rCard.bottom + 0.5 && rNome.top >= rCard.top,
        alt: li.querySelector("img")?.alt ?? "",
        frase: li.querySelector(".logo__nota")?.textContent.trim() ?? null,
      };
    });
  }, radice);

/* ---------- /loghi ---------- */
let dettagli = [];

for (const vp of VIEWPORT) {
  const { page, context, errori } = await nuovaPagina(vp);
  const risposta = await page.goto(BASE + "/loghi", { waitUntil: "networkidle" });
  atteso(risposta?.ok(), `${vp.w}px /loghi: la pagina carica (${risposta?.status()})`);

  const h1 = await page.locator("h1").allTextContents();
  atteso(h1.length === 1 && h1[0].trim() === "Loghi", `${vp.w}px /loghi: un solo h1, "Loghi"`);

  const riquadri = await leggiRiquadri(page);
  atteso(riquadri.length >= 4, `${vp.w}px /loghi: ${riquadri.length} riquadri`);
  dettagli = riquadri.map((r) => ({ href: r.href, tipo: r.tipo }));

  // Riquadri quadrati, 2 colonne a 390 e 4 a 1280
  const griglia = await page.evaluate(() => {
    const campi = [...document.querySelectorAll("main .logo__campo")].map((c) =>
      c.getBoundingClientRect(),
    );
    const colonne = new Set(campi.map((r) => Math.round(r.top))).size;
    return {
      quadrati: campi.every((r) => Math.abs(r.width - r.height) < 1),
      perRiga: campi.filter((r) => Math.round(r.top) === Math.round(campi[0].top)).length,
      righe: colonne,
    };
  });
  atteso(griglia.quadrati, `${vp.w}px /loghi: i riquadri sono quadrati`);
  atteso(
    griglia.perRiga === Math.min(vp.w >= 1024 ? 4 : 2, riquadri.length),
    `${vp.w}px /loghi: ${griglia.perRiga} riquadri per riga`,
  );

  for (const r of riquadri) {
    atteso(
      r.tipo === "progetto"
        ? r.etichetta === null && !r.parolaProgetto
        : r.tipoVisibile && r.etichetta === ETICHETTE[r.tipo],
      `${vp.w}px /loghi ${r.href}: ${r.tipo === "progetto" ? "nessuna etichetta Progetto" : `etichetta del tipo visibile (${r.etichetta})`}`,
    );
    atteso(
      r.alt.includes(r.nome) && r.alt.includes(ETICHETTE[r.tipo]),
      `${vp.w}px /loghi ${r.href}: alt con nome e tipo ("${r.alt}")`,
    );
    const vuoleFrase = TIPI_CON_FRASE.includes(r.tipo);
    atteso(
      vuoleFrase ? r.frase === NON_AFFILIATO : r.frase === null,
      `${vp.w}px /loghi ${r.href}: frase di non affiliazione ${vuoleFrase ? "presente" : "assente"} (${r.tipo})`,
    );
  }

  // Nome: sempre visibile su touch; su desktop solo al passaggio del mouse
  if (vp.touch) {
    atteso(riquadri.every((r) => r.nomeVisibile), `${vp.w}px /loghi: su touch il nome è sempre visibile`);
  } else {
    atteso(riquadri.every((r) => !r.nomeVisibile), `${vp.w}px /loghi: a riposo il nome è nascosto`);
    await page.locator("main [data-stile] a").first().hover();
    await page.waitForTimeout(400);
    const dopo = await leggiRiquadri(page);
    atteso(dopo[0].nomeVisibile, `${vp.w}px /loghi: al passaggio del mouse il nome compare`);
    await page.mouse.move(0, 0);
  }

  // Filtri: uno per stile usato, più "Tutti"
  const stili = [...new Set(riquadri.map((r) => r.stile))];
  const bottoni = page.locator("[data-filtri] button");
  atteso(await page.locator("[data-filtri]").isVisible(), `${vp.w}px /loghi: con JavaScript i filtri sono visibili`);
  atteso(
    (await bottoni.count()) === stili.length + 1,
    `${vp.w}px /loghi: ${await bottoni.count()} filtri per ${stili.length} stili più "Tutti"`,
  );
  atteso(
    (await bottoni.first().getAttribute("aria-pressed")) === "true" &&
      (await bottoni.first().textContent()).trim() === "Tutti",
    `${vp.w}px /loghi: "Tutti" è premuto all'avvio`,
  );

  const statoFiltri = () =>
    page.evaluate(() => ({
      premuti: [...document.querySelectorAll("[data-filtri] button")]
        .filter((b) => b.getAttribute("aria-pressed") === "true")
        .map((b) => b.dataset.filtro),
      visibili: [...document.querySelectorAll("main [data-stile]")]
        .filter((li) => li.getClientRects().length > 0)
        .map((li) => li.dataset.stile),
    }));

  for (const stile of stili) {
    const bottone = page.locator(`[data-filtri] button[data-filtro="${stile}"]`);
    await bottone.click();
    const s = await statoFiltri();
    const attesi = riquadri.filter((r) => r.stile === stile).length;
    atteso(
      s.premuti.length === 1 &&
        s.premuti[0] === stile &&
        s.visibili.length === attesi &&
        s.visibili.every((v) => v === stile),
      `${vp.w}px /loghi: il filtro "${stile}" mostra ${s.visibili.length} di ${riquadri.length}`,
    );
  }

  // Premere di nuovo lo stile attivo torna a "Tutti"
  const ultimo = stili.at(-1);
  await page.locator(`[data-filtri] button[data-filtro="${ultimo}"]`).click();
  let s = await statoFiltri();
  atteso(
    s.premuti.length === 1 && s.premuti[0] === "" && s.visibili.length === riquadri.length,
    `${vp.w}px /loghi: premere lo stile attivo torna a "Tutti"`,
  );

  // Da tastiera: Tab fino al secondo filtro, Spazio lo attiva, Invio su "Tutti"
  await page.locator("[data-filtri] button").nth(0).focus();
  await page.keyboard.press("Tab");
  const focusato = await page.evaluate(() => document.activeElement?.dataset.filtro);
  atteso(focusato === stili[0], `${vp.w}px /loghi: Tab passa al filtro successivo`);
  await page.keyboard.press("Space");
  s = await statoFiltri();
  atteso(
    s.premuti[0] === stili[0] && s.visibili.every((v) => v === stili[0]),
    `${vp.w}px /loghi: Spazio attiva il filtro`,
  );
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Enter");
  s = await statoFiltri();
  atteso(
    s.premuti[0] === "" && s.visibili.length === riquadri.length,
    `${vp.w}px /loghi: Invio su "Tutti" mostra tutto`,
  );
  atteso(
    await page.evaluate(() => {
      const b = document.querySelector("[data-filtri] button");
      b.focus({ focusVisible: true });
      return getComputedStyle(b).outlineStyle !== "none";
    }),
    `${vp.w}px /loghi: focus visibile sui filtri`,
  );

  atteso(await immaginiCaricate(page), `${vp.w}px /loghi: immagini caricate`);
  atteso(await senzaOverflow(page), `${vp.w}px /loghi: nessun overflow orizzontale`);
  atteso(errori.length === 0, `${vp.w}px /loghi: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await context.close();
}

/* ---------- /loghi senza JavaScript ---------- */
{
  const { page, context } = await nuovaPagina(VIEWPORT[1], { javaScriptEnabled: false });
  await page.goto(BASE + "/loghi", { waitUntil: "load" });
  const stato = await page.evaluate(() => ({
    filtri: document.querySelector("[data-filtri]")?.getClientRects().length ?? 0,
    totali: document.querySelectorAll("main [data-stile]").length,
    visibili: [...document.querySelectorAll("main [data-stile]")].filter(
      (li) => li.getClientRects().length > 0,
    ).length,
  }));
  atteso(
    stato.filtri === 0 && stato.visibili === stato.totali && stato.totali > 0,
    `senza JavaScript: filtri nascosti, ${stato.visibili} di ${stato.totali} loghi visibili`,
  );
  await context.close();
}

/* ---------- /loghi/[slug] ---------- */
for (const vp of VIEWPORT) {
  for (const { href, tipo } of dettagli) {
    const { page, context, errori } = await nuovaPagina(vp);
    const risposta = await page.goto(BASE + href, { waitUntil: "networkidle" });
    atteso(risposta?.ok(), `${vp.w}px ${href}: la pagina carica`);

    const d = await page.evaluate(() => {
      const tags = [...document.querySelectorAll(".dettaglio__tags li")].map((t) =>
        t.textContent.trim(),
      );
      return {
        h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
        tags,
        tagVisibile: document.querySelector(".dettaglio__tags li")?.getClientRects().length > 0,
        alt: document.querySelector(".dettaglio__logo")?.alt ?? "",
        frasi: [...document.querySelectorAll(".dettaglio__nota")].map((p) => p.textContent.trim()),
        haPrima: Boolean(document.querySelector("#prima-dopo")),
        testo: document.querySelector(".dettaglio__testo")?.textContent.trim() ?? null,
        descrizione: document.querySelector('meta[name="description"]')?.content ?? "",
        // Ogni sezione di formato ha almeno un'immagine: niente sezioni vuote.
        sezioniVuote: [...document.querySelectorAll(".dettaglio__sezione")].filter(
          (s) => s.querySelectorAll("img").length === 0,
        ).length,
        sezioni: [...document.querySelectorAll(".dettaglio__sezione h2")].map((h) =>
          h.textContent.trim(),
        ),
      };
    });

    atteso(d.h1.length === 1, `${vp.w}px ${href}: un solo h1 (${d.h1[0]})`);
    atteso(
      tipo === "progetto"
        ? d.tags.length === 1 && !d.tags.includes("Progetto") && d.tagVisibile
        : d.tags[0] === ETICHETTE[tipo] && d.tagVisibile,
      `${vp.w}px ${href}: ${tipo === "progetto" ? "nessuna etichetta Progetto, resta lo stile" : "etichetta del tipo"} (${d.tags.join(", ")})`,
    );
    atteso(
      d.alt.includes(d.h1[0]) && d.alt.includes(ETICHETTE[tipo]),
      `${vp.w}px ${href}: alt con nome e tipo ("${d.alt}")`,
    );
    // Il testo, se c'è, è anche la description della pagina
    atteso(
      d.testo === null || (d.testo.length > 0 && d.descrizione === d.testo),
      `${vp.w}px ${href}: ${d.testo === null ? "nessun testo" : "testo visibile e usato come description"}`,
    );
    // Ogni logo ha la sua spiegazione: da tre a quattro frasi
    const frasiTesto = (d.testo ?? "").split(/[.!?](?:\s|$)/).filter(Boolean).length;
    atteso(
      frasiTesto >= 3 && frasiTesto <= 4,
      `${vp.w}px ${href}: spiegazione di ${frasiTesto} frasi (attese 3 o 4)`,
    );
    const vuoleFrase = TIPI_CON_FRASE.includes(tipo);
    // Sotto il logo grande, e anche sotto il prima e dopo se c'è
    const frasiAttese = vuoleFrase ? (d.haPrima ? 2 : 1) : 0;
    atteso(
      d.frasi.length === frasiAttese && d.frasi.every((f) => f === NON_AFFILIATO),
      `${vp.w}px ${href}: ${d.frasi.length} frasi di non affiliazione (attese ${frasiAttese})`,
    );
    atteso(
      d.sezioniVuote === 0,
      `${vp.w}px ${href}: solo formati con immagini (${["Logo", ...d.sezioni].join(", ")})`,
    );
    atteso(await immaginiCaricate(page), `${vp.w}px ${href}: immagini caricate`);
    atteso(await senzaOverflow(page), `${vp.w}px ${href}: nessun overflow orizzontale`);
    atteso(errori.length === 0, `${vp.w}px ${href}: nessun errore in console`);
    if (errori.length) console.error("   ", errori.slice(0, 3));
    await context.close();
  }
}

/* ---------- Home: striscia, nav e footer ---------- */
for (const vp of VIEWPORT) {
  const { page, context, errori } = await nuovaPagina(vp);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const h = await page.evaluate(() => {
    const striscia = document.querySelector('section[aria-labelledby="loghi-striscia-titolo"]');
    const griglia = document.querySelector("#progetti");
    return {
      esiste: Boolean(striscia),
      titolo: striscia?.querySelector("h2")?.textContent.trim(),
      dopoProgetti:
        Boolean(striscia && griglia) &&
        Boolean(griglia.compareDocumentPosition(striscia) & Node.DOCUMENT_POSITION_FOLLOWING),
      hrefs: [...(striscia?.querySelectorAll("[data-insieme] [data-stile] a") ?? [])].map((a) =>
        a.getAttribute("href"),
      ),
      linkTutti: [...(striscia?.querySelectorAll('a[href="/loghi"]') ?? [])].map((a) =>
        a.textContent.trim(),
      ),
      vociNav: document.querySelectorAll(".site-nav__list > li").length,
      navLoghi: document.querySelectorAll('header a[href="/loghi"]').length,
      footerLoghi: document.querySelectorAll('body > footer a[href="/loghi"]').length,
    };
  });
  atteso(h.esiste && h.titolo === "Loghi", `${vp.w}px home: c'è la striscia "Loghi"`);
  atteso(h.dopoProgetti, `${vp.w}px home: la striscia viene dopo la griglia progetti`);
  atteso(
    h.hrefs.join() === dettagli.slice(0, 4).map((d) => d.href).join(),
    `${vp.w}px home: i quattro loghi nella fila del carosello (${h.hrefs.length})`,
  );
  atteso(
    h.linkTutti.includes("Vedi tutti i loghi"),
    `${vp.w}px home: link "Vedi tutti i loghi"`,
  );
  atteso(h.vociNav === 3 && h.navLoghi === 1, `${vp.w}px home: navbar a tre voci, con Loghi`);
  atteso(h.footerLoghi === 1, `${vp.w}px home: /loghi nel footer`);

  const riquadri = await leggiRiquadri(page, 'section[aria-labelledby="loghi-striscia-titolo"]');
  atteso(
    riquadri.every(
      (r) =>
        (r.tipo === "progetto" ? r.etichetta === null && !r.parolaProgetto : r.tipoVisibile) &&
        (TIPI_CON_FRASE.includes(r.tipo) ? r.frase === NON_AFFILIATO : r.frase === null),
    ),
    `${vp.w}px home: nessuna etichetta Progetto e frase di non affiliazione solo dove serve`,
  );
  atteso(await senzaOverflow(page), `${vp.w}px home: nessun overflow orizzontale`);
  atteso(errori.length === 0, `${vp.w}px home: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await context.close();
}

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche loghi passate");
}
