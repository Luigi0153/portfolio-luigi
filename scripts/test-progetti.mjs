/*
  Verifica della sezione progetti e del case study, a 390 e 1280:
  - lista: quattro card, ordine che segue il percorso scelto, nessun "in arrivo",
    copertine fotografiche per tutti i progetti, a 1280 le tre piccole su una riga;
  - dettaglio: due colonne con colonna pinnata a 1280, una colonna a 390;
  - caso reale (Sisters Store): sei sezioni, link al sito vero, il sito nuovo
    in quattro parti con slider e gallerie al loro posto;
  - concept (Fornace Vietri, pizzeria, palestra): riga concept, capitoli in ordine,
    immagini al loro posto, galleria affiancata a 1280 e scorrevole una alla
    volta a 390, og-image;
  - due slider prima/dopo (home da desktop a tutta colonna, scheda da telefono
    393x852 a doppia risoluzione), guidabili da tastiera, etichette Prima e Dopo;
  - View Transitions: la navigazione interna non perde il percorso scelto;
  - conteggio dei numeri: il valore finale è quello giusto anche dopo l'animazione.
  Uso: node scripts/test-progetti.mjs   (server su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const browser = await chromium.launch();
let fallimenti = 0;

const ok = (msg) => console.log(`✓ ${msg}`);
const ko = (msg) => {
  fallimenti++;
  console.error(`✗ ${msg}`);
};
const atteso = (cond, msg) => (cond ? ok(msg) : ko(msg));

const nuovaPagina = async (vp, target) => {
  const page = await browser.newPage({ viewport: { width: vp, height: 900 } });
  const errori = [];
  page.on("pageerror", (e) => errori.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errori.push(m.text()));
  if (target) await page.addInitScript((t) => localStorage.setItem("target", t), target);
  return { page, errori };
};

/* ---------- Lista ---------- */
for (const vp of [390, 1280]) {
  for (const target of ["dev", "business"]) {
    const { page, errori } = await nuovaPagina(vp, target);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    await page.waitForTimeout(1200);

    const celle = page.locator(".progetti__cella");
    atteso((await celle.count()) === 4, `${vp}px ${target}: quattro card in griglia`);

    // a 1280 le tre card piccole stanno su una riga, sotto la grande
    if (vp === 1280) {
      const righe = await page.$$eval(".progetti__cella:not(.progetti__cella--grande)", (c) =>
        new Set(c.map((el) => Math.round(el.getBoundingClientRect().top))).size,
      );
      atteso(righe === 1, `${vp}px ${target}: le tre card piccole su una riga (${righe})`);
    }

    // ordine come lo vede l'utente: posizione sullo schermo, non ordine nel DOM
    const ordine = await page.evaluate(() =>
      [...document.querySelectorAll(".progetti__cella")]
        .map((el) => ({
          titolo: el.querySelector(".progetti__titolo")?.textContent?.trim() ?? "",
          r: el.getBoundingClientRect(),
        }))
        .sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left)
        .map((c) => c.titolo),
    );

    atteso(
      ordine[0] === "Creazione e rebranding",
      `${vp}px ${target}: il progetto reale è il primo`,
    );
    const secondo = target === "dev" ? "Fornace Vietri" : "Pizzeria Vico Stretto";
    atteso(ordine[1] === secondo, `${vp}px ${target}: al secondo posto "${secondo}"`);

    // i due concept portano l'etichetta del tipo, il caso reale il nome del negozio
    const tipi = await page.$$eval(".progetti__cella", (celle) =>
      Object.fromEntries(
        celle.map((c) => [
          c.querySelector("a").getAttribute("href"),
          c.querySelector(".progetti__lente").textContent.trim(),
        ]),
      ),
    );
    atteso(
      tipi["/progetti/fornace-vietri"].startsWith("Branding concept · ") &&
        tipi["/progetti/pizzeria"].startsWith("Branding concept · ") &&
        tipi["/progetti/palestra"].startsWith("Branding concept · ") &&
        tipi["/progetti/sisters-store"] === "Sisters Store · decisione",
      `${vp}px ${target}: "Branding concept" sui due concept, "Sisters Store · decisione" sul caso reale (${tipi["/progetti/sisters-store"]})`,
    );

    // nessun progetto è più "in arrivo"
    const inArrivo = await page.$$eval(".progetti__cella", (celle) =>
      celle.filter((c) => /in arrivo/i.test(c.textContent)).length,
    );
    atteso(inArrivo === 0, `${vp}px ${target}: nessuna card "in arrivo"`);

    // tutti i progetti hanno la copertina fotografica, caricata davvero
    for (const [slug, file] of [
      ["sisters-store", "sisters-copertina"],
      ["fornace-vietri", "fornace-copertina"],
      ["pizzeria", "pizzeria-copertina"],
      ["palestra", "palestra-copertina"],
    ]) {
      const cover = page.locator(`.progetti__cella a[href="/progetti/${slug}"] img`);
      await cover.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const coverOk = await cover.evaluate(
        (img, f) => img.complete && img.naturalWidth > 0 && img.currentSrc.includes(f),
        file,
      );
      atteso(coverOk, `${vp}px ${target}: ${slug} ha la copertina come cover`);
    }

    atteso(errori.length === 0, `${vp}px ${target}: nessun errore in console`);
    if (errori.length) console.error("   ", errori.slice(0, 3));
    await page.close();
  }
}

/* ---------- Dettaglio ---------- */
for (const vp of [390, 1280]) {
  const { page, errori } = await nuovaPagina(vp);
  await page.goto(BASE + "/progetti/sisters-store", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(1200);

  const sezioni = await page.locator(".caso__sezione-titolo").allTextContents();
  atteso(
    sezioni.map((s) => s.trim()).join(" | ") ===
      "Contesto | Decisione | Cosa ho fatto nella fase 1 | Il risultato della fase 1 | Il sito nuovo | Cosa ho imparato",
    `${vp}px dettaglio: le sei sezioni nell'ordine giusto`,
  );

  // titolo, nome del negozio sopra il titolo, <title> e og:title
  const testa = await page.evaluate(() => ({
    h1: document.querySelector(".caso__titolo")?.textContent.trim(),
    sopra: document.querySelector(".caso__lente")?.textContent.trim(),
    title: document.title,
    og: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
  }));
  atteso(
    testa.h1 === "Creazione e rebranding" && testa.sopra === "Sisters Store · decisione" &&
      testa.title.startsWith("Creazione e rebranding |") && testa.og === testa.title,
    `${vp}px dettaglio: titolo, nome sopra, title e og:title (${JSON.stringify(testa)})`,
  );

  // il link al sito vero, sotto il titolo, in una scheda nuova
  const sito = await page.evaluate(() => {
    const a = document.querySelector(".caso__sito a");
    return a && { href: a.getAttribute("href"), target: a.target, rel: a.rel, testo: a.textContent.replace(/\s+/g, " ").trim() };
  });
  atteso(
    sito?.href === "https://sistersstore.it" && sito.target === "_blank" && sito.rel.includes("noopener") &&
      sito.testo.startsWith("sistersstore.it"),
    `${vp}px dettaglio: link a sistersstore.it in una scheda nuova (${JSON.stringify(sito)})`,
  );

  // il sito nuovo: quattro parti, ogni slider e immagine al suo posto
  const posto = await page.evaluate(() => {
    const file = (img) => (img.getAttribute("src") ?? "").match(/sisters-[a-z0-9-]+?(?=[._])/)?.[0];
    const sotto = [...document.querySelectorAll(".caso__sezione:has(#sez-sito-nuovo) .caso__sotto")];
    return {
      cover: document.querySelector(".caso__cover")?.getAttribute("src")?.includes("sisters-copertina"),
      vecchie: [...document.querySelectorAll("img")].filter((i) => /\/caso-|boutique/i.test(i.getAttribute("src") ?? "")).length,
      parti: sotto.map((s) => ({
        titolo: s.querySelector(".caso__sotto-titolo")?.textContent.trim(),
        slider: s.querySelectorAll(".ba__range").length,
        largo: !!s.querySelector(".ba__host--largo"),
        immagini: [...s.querySelectorAll(".caso__schermata img")].map(file),
        etichette: [...s.querySelectorAll(".caso__schermata-etichetta")].map((e) => e.textContent.trim()),
      })),
    };
  });
  atteso(posto.cover, `${vp}px dettaglio: la copertina in cima alla pagina`);
  atteso(posto.vecchie === 0, `${vp}px dettaglio: nessuna immagine vecchia (caso-*, boutique)`);
  const [home, scheda, collezioni, identita] = posto.parti;
  atteso(
    posto.parti.map((p) => p.titolo).join(" | ") === "La home | La scheda prodotto | Le collezioni | L'identità",
    `${vp}px dettaglio: il sito nuovo in quattro parti (${posto.parti.map((p) => p.titolo).join(" | ")})`,
  );
  atteso(
    home?.slider === 1 && home.largo && home.immagini.join(" ") === "sisters-prima-home sisters-dopo-home",
    `${vp}px dettaglio: la home ha lo slider largo e le due home da telefono (${home?.immagini.join(" ")})`,
  );
  atteso(
    scheda?.slider === 1 && !scheda.largo && scheda.immagini.length === 0,
    `${vp}px dettaglio: la scheda prodotto ha lo slider da telefono`,
  );
  atteso(
    collezioni?.slider === 0 &&
      collezioni.immagini.join(" ") ===
        "sisters-prima-collezione sisters-prima-filtri sisters-dopo-collezione sisters-dopo-filtri" &&
      collezioni.etichette.join(" | ") === "Prima | Prima, i filtri | Dopo | Dopo, i filtri",
    `${vp}px dettaglio: le collezioni in galleria, prima e dopo (${collezioni?.immagini.join(" ")})`,
  );
  atteso(
    identita?.slider === 0 && identita.immagini.length === 0,
    `${vp}px dettaglio: l'identità è solo testo`,
  );

  // tutte le immagini hanno un alt vero e, scorrendo, si caricano
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.$$eval(".caso__galleria", (g) => g.forEach((el) => el.scrollTo({ left: el.scrollWidth })));
  await page.waitForTimeout(800);
  const immagini = await page.$$eval(".caso img", (imgs) => ({
    senzaAlt: imgs.filter((i) => i.alt.trim().length <= 20).length,
    nonCaricate: imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute("src")),
  }));
  atteso(immagini.senzaAlt === 0, `${vp}px dettaglio: ogni immagine ha un alt descrittivo`);
  atteso(
    immagini.nonCaricate.length === 0,
    `${vp}px dettaglio: tutte le immagini si caricano ${immagini.nonCaricate.join(" ")}`,
  );

  atteso(
    await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    `${vp}px dettaglio: nessun overflow orizzontale della pagina`,
  );

  // due colonne solo da 1024 in su: sopra, titolo e corpo sono affiancati
  const affiancati = await page.evaluate(() => {
    const col = document.querySelector(".caso__colonna").getBoundingClientRect();
    const corpo = document.querySelector(".caso__corpo").getBoundingClientRect();
    return corpo.left >= col.right - 2;
  });
  atteso(
    vp === 1280 ? affiancati : !affiancati,
    `${vp}px dettaglio: ${vp === 1280 ? "due colonne" : "una colonna sola"}`,
  );

  // il pin è attivo solo a 1280: ScrollTrigger avvolge la colonna in un wrapper
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await page.waitForTimeout(700);
  const pinnata = await page.evaluate(
    () => !!document.querySelector(".pin-spacer") ||
      getComputedStyle(document.querySelector("[data-pin]")).position === "fixed",
  );
  atteso(vp === 1280 ? pinnata : !pinnata, `${vp}px dettaglio: pin ${vp === 1280 ? "attivo" : "assente"}`);

  // i numeri contati finiscono sul valore vero, non su uno intermedio
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1600);
  const valori = await page.locator(".stat__value").allTextContents();
  atteso(
    valori.map((v) => v.replace(/\s/g, "")).join(" ") === "2,6volte +37% 93%",
    `${vp}px dettaglio: i numeri contati arrivano a 2,6 volte +37% 93% (letti: ${valori.join(" | ")})`,
  );

  // grafico della conversione e funnel: i valori scritti sono quelli di docs/content/caso-reale.md
  const ramp = await page.$$eval(".ramp__valore", (els) => els.map((e) => e.textContent.trim()));
  atteso(
    ramp.join(" ") === "0,19% 0,35% 0,36% 0,50%",
    `${vp}px dettaglio: la conversione mensile è 0,19% 0,35% 0,36% 0,50% (letti: ${ramp.join(" ")})`,
  );
  const funnel = await page.$$eval(".funnel__valore", (els) => els.map((e) => e.textContent.trim()));
  atteso(
    funnel.join(" ") === "12.025 4,25% 76,5% 10,0%",
    `${vp}px dettaglio: il funnel è 12.025 4,25% 76,5% 10,0% (letti: ${funnel.join(" ")})`,
  );

  atteso(errori.length === 0, `${vp}px dettaglio: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await page.close();
}

/* ---------- Dettaglio dei concept ---------- */
const TIPO_CONCEPT = "Branding concept";
const NOTA_CONCEPT = "Brand e negozio online, progetto inventato. Le foto sono generate con l'AI.";
const CONCEPT = [
  {
    slug: "fornace-vietri",
    copertina: "fornace-copertina",
    nota: NOTA_CONCEPT,
    capitoli: ["Il laboratorio", "Il problema", "La decisione", "Il sistema", "Cosa ho imparato", "Nel negozio vero farei"],
    figure: { "fornace-brand": "sez-laboratorio", "fornace-stati": "sez-decisione" },
    elenchi: {},
    galleria: { capitolo: "sez-sistema", schermate: 4 },
  },
  {
    slug: "pizzeria",
    copertina: "pizzeria-copertina",
    nota: "Brand e sito, progetto inventato. Le foto sono stock, da Unsplash.",
    capitoli: ["La pizzeria", "Il problema", "Il flusso", "La decisione", "Cosa ho tolto", "La pagina", "Cosa ho imparato", "Nel locale vero farei"],
    figure: { "pizzeria-brand": "sez-pizzeria", "pizzeria-flusso": "sez-flusso" },
    // figura con una versione ricomposta sotto i 768px (<picture>)
    mobile: "pizzeria-flusso",
    // capitolo -> tipo di lista e numero di voci
    elenchi: { "sez-flusso": "ol 3", "sez-tolto": "ul 4", "sez-pagina": "ul 4" },
    galleria: { capitolo: "sez-pagina", schermate: 3 },
  },
  {
    slug: "palestra",
    copertina: "palestra-copertina",
    nota: "Brand e sito, progetto inventato. Le foto sono stock, da Unsplash.",
    capitoli: ["La palestra", "L'idea", "Il percorso", "Nel sito", "La decisione", "Cosa ho imparato", "Nella palestra vera farei"],
    figure: { "palestra-brand": "sez-palestra", "palestra-percorso": "sez-percorso", "palestra-pesi": "sez-sito" },
    mobile: "palestra-percorso",
    elenchi: { "sez-percorso": "ol 3", "sez-sito": "ul 4" },
    galleria: { capitolo: "sez-sito", schermate: 4 },
  },
];

for (const concetto of CONCEPT) {
  for (const vp of [390, 1280]) {
    const { slug } = concetto;
    const { page, errori } = await nuovaPagina(vp);
    await page.goto(BASE + "/progetti/" + slug, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    await page.waitForTimeout(1000);

    // la riga concept sta subito sotto il titolo
    const nota = await page.evaluate(() => {
      const h1 = document.querySelector("h1.caso__titolo");
      const dopo = h1?.nextElementSibling;
      return dopo?.classList.contains("caso__nota") ? dopo.textContent.trim() : null;
    });
    atteso(
      nota === concetto.nota,
      `${vp}px ${slug}: riga concept subito sotto il titolo`,
    );

    // l'etichetta del tipo sta sopra il titolo, prima della lente
    const etichetta = await page.locator(".caso__lente").textContent();
    atteso(
      etichetta.trim().startsWith(TIPO_CONCEPT + " · "),
      `${vp}px ${slug}: etichetta "${TIPO_CONCEPT}" sopra il titolo`,
    );

    atteso(
      !/in arrivo/i.test(await page.locator(".caso__colonna").textContent()),
      `${vp}px ${slug}: nessun tag "in arrivo"`,
    );

    const sezioni = await page.locator(".caso__sezione-titolo").allTextContents();
    atteso(
      sezioni.map((s) => s.trim()).join(" | ") === concetto.capitoli.join(" | "),
      `${vp}px ${slug}: ${concetto.capitoli.length} capitoli nell'ordine giusto`,
    );

    // passi numerati e liste puntate, con i marcatori visibili
    const elenchi = await page.$$eval(".caso__elenco", (liste) =>
      Object.fromEntries(
        liste.map((l) => [
          l.closest(".caso__sezione").querySelector("h2").id,
          `${l.tagName.toLowerCase()} ${l.children.length}${getComputedStyle(l).listStyleType === "none" ? " senza marcatori" : ""}`,
        ]),
      ),
    );
    atteso(
      JSON.stringify(elenchi) === JSON.stringify(concetto.elenchi),
      `${vp}px ${slug}: elenchi al loro posto (${JSON.stringify(elenchi)})`,
    );

    // ogni immagine nel capitolo giusto
    const posto = await page.evaluate(
      ({ figure, copertina }) => {
        const dove = (el) => el?.closest(".caso__sezione")?.querySelector("h2")?.id;
        const figura = Object.fromEntries(
          Object.keys(figure).map((f) => [f, dove(document.querySelector(`.caso__figura img[src*="${f}"]`))]),
        );
        const cover = document.querySelector(".caso__cover")?.getAttribute("src") ?? "";
        return {
          figura,
          galleria: dove(document.querySelector(".caso__galleria")),
          cover: cover.includes(copertina),
        };
      },
      { figure: concetto.figure, copertina: concetto.copertina },
    );
    atteso(posto.cover, `${vp}px ${slug}: la copertina in cima alla pagina`);
    for (const [figura, capitolo] of Object.entries(concetto.figure)) {
      atteso(posto.figura[figura] === capitolo, `${vp}px ${slug}: ${figura} dentro ${capitolo}`);
    }
    atteso(
      posto.galleria === concetto.galleria.capitolo,
      `${vp}px ${slug}: galleria dentro ${concetto.galleria.capitolo}`,
    );

    // tutte le immagini hanno un alt vero e, una volta in vista, si caricano
    const galleria = page.locator(".caso__galleria");
    await galleria.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const schermate = await page.$$eval(".caso__schermata", (li) =>
      li.map((el) => {
        const r = el.getBoundingClientRect();
        const img = el.querySelector("img");
        return { top: r.top, left: r.left, w: r.width, alt: img.alt.length, src: img.getAttribute("src") };
      }),
    );
    atteso(
      schermate.length === concetto.galleria.schermate,
      `${vp}px ${slug}: ${concetto.galleria.schermate} schermate in galleria`,
    );
    const alt = await page.$$eval(".caso img", (imgs) => imgs.every((i) => i.alt.trim().length > 20));
    atteso(alt, `${vp}px ${slug}: ogni immagine ha un alt descrittivo`);

    if (vp === 1280) {
      const stessaRiga = schermate.every((s) => Math.abs(s.top - schermate[0].top) < 2);
      const inColonna = await page.evaluate(() => {
        const g = document.querySelector(".caso__galleria").getBoundingClientRect();
        const c = document.querySelector(".caso__corpo").getBoundingClientRect();
        return g.left >= c.left - 1 && g.right <= c.right + 1;
      });
      atteso(stessaRiga && inColonna, `${vp}px ${slug}: schermate affiancate dentro la colonna`);
    } else {
      // una alla volta: la prima occupa quasi tutta la larghezza, la seconda spunta a destra
      const scorre = await galleria.evaluate((g) => ({
        overflow: g.scrollWidth > g.clientWidth + 10,
        snap: getComputedStyle(g).scrollSnapType,
        tab: g.tabIndex,
      }));
      const [a, b] = schermate;
      atteso(
        scorre.overflow && scorre.snap.startsWith("x") && scorre.tab === 0,
        `${vp}px ${slug}: galleria scorrevole in orizzontale con snap e raggiungibile da tastiera`,
      );
      atteso(
        a.w > vp * 0.7 && b.left < vp && b.left > vp * 0.75,
        `${vp}px ${slug}: una schermata alla volta, la seguente visibile a destra (${Math.round(a.w)}px, ${Math.round(b.left)}px)`,
      );

      // scorrendo, la galleria si ferma sulla schermata seguente
      // oltre metà schermata: lo snap deve completare lo scorrimento sulla seconda
      await galleria.evaluate((g) => g.scrollBy({ left: 200, behavior: "instant" }));
      await page.waitForTimeout(600);
      const allineata = await page.evaluate(() => {
        const g = document.querySelector(".caso__galleria");
        const seconda = document.querySelectorAll(".caso__schermata")[1].getBoundingClientRect();
        return Math.abs(seconda.left - (g.getBoundingClientRect().left + parseFloat(getComputedStyle(g).scrollPaddingLeft)));
      });
      atteso(allineata < 3, `${vp}px ${slug}: lo scorrimento si ferma sulla seconda schermata (scarto ${allineata.toFixed(1)}px)`);
    }

    // tutte le immagini della pagina caricate, dall'alto in basso
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.$$eval(".caso__galleria", (g) => g.forEach((el) => el.scrollTo({ left: el.scrollWidth })));
    await page.waitForTimeout(800);
    const caricate = await page.$$eval(".caso img", (imgs) =>
      imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute("src")),
    );
    atteso(caricate.length === 0, `${vp}px ${slug}: tutte le immagini si caricano ${caricate.join(" ")}`);

    if (concetto.mobile) {
      const corrente = await page.$eval(`.caso__figura picture img[src*="${concetto.mobile}"]`, (i) => i.currentSrc);
      const mobile = corrente.includes(`${concetto.mobile}-mobile`);
      atteso(
        vp < 768 ? mobile : !mobile && corrente.includes(concetto.mobile),
        `${vp}px ${slug}: ${concetto.mobile} nella versione ${vp < 768 ? "mobile" : "larga"}`,
      );
    }

    const senzaOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
    atteso(senzaOverflow, `${vp}px ${slug}: nessun overflow orizzontale della pagina`);

    const og = await page.getAttribute('meta[property="og:image"]', "content");
    const ogRisposta = og ? await page.request.get(BASE + new URL(og).pathname) : null;
    // le og delle copertine dei tre concept sono JPEG sotto i 200 KB (campo og del progetto)
    const ogPeso = ogRisposta?.ok() ? (await ogRisposta.body()).length : 0;
    atteso(
      og?.endsWith(`/og/${slug}.jpg`) && ogRisposta?.ok() && ogPeso < 200 * 1024,
      `${vp}px ${slug}: og-image presente e servita (${og}, ${Math.round(ogPeso / 1024)} KB)`,
    );

    atteso(errori.length === 0, `${vp}px ${slug}: nessun errore in console`);
    if (errori.length) console.error("   ", errori.slice(0, 3));
    await page.close();
  }
}

/* ---------- Slider prima/dopo da tastiera ---------- */
{
  const { page } = await nuovaPagina(1280);
  await page.goto(BASE + "/progetti/sisters-store", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  // due slider: la home da desktop (largo) e la scheda da telefono. Da tastiera si prova il secondo.
  atteso((await page.locator(".ba__host").count()) === 2, "slider: due slider nella pagina");
  const slider = page.locator(".ba__range").nth(1);
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // posizione di partenza: la home parte al 19%, cioè al 10% dello schermo del computer (si legge il titolo dell'hero), la scheda a metà
  const partenze = await page.$$eval(".ba__range", (r) => r.map((el) => el.value));
  atteso(
    partenze.join(",") === "19,50",
    `slider: home parte al 19%, scheda al 50% (${partenze.join(", ")})`,
  );

  const prima = await slider.inputValue();
  await slider.focus();
  const haFocus = await page.evaluate(() =>
    document.activeElement?.classList.contains("ba__range"),
  );
  atteso(haFocus, "slider: riceve il focus da tastiera");

  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const dopo = await slider.inputValue();
  atteso(Number(dopo) > Number(prima), `slider: le frecce muovono il taglio (${prima} -> ${dopo})`);

  // il taglio dell'immagine segue davvero il valore
  const clip = await page.evaluate(
    () => getComputedStyle(document.querySelectorAll(".ba__img--dopo")[1]).clipPath,
  );
  atteso(clip.includes("%"), `slider: l'immagine "dopo" è tagliata alla posizione (${clip})`);

  const tag = await page.locator(".ba__tag").allTextContents();
  atteso(
    tag.join(" | ") === "Prima | Dopo | Prima | Dopo",
    `slider: etichette Prima e Dopo (${tag.join(" | ")})`,
  );

  // le schermate: stessa misura dentro ogni slider, nell'ordine prima e dopo
  await page.locator(".ba__host").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const misure = await page.$$eval(".ba__img", (imgs) =>
    imgs.map((i) => ({ w: i.naturalWidth, h: i.naturalHeight, src: i.currentSrc })),
  );
  const [hp, hd, sp, sd] = misure;
  atteso(
    misure.length === 4 && [hp, hd].every((m) => m.w === 1840 && m.h === 1240) &&
      [sp, sd].every((m) => m.w === 1034 && m.h === 2402),
    `slider: home 1840x1240 e scheda 1034x2402, nelle cornici di prepara-sisters (${misure.map((m) => `${m.w}x${m.h}`).join(", ")})`,
  );
  atteso(
    hp?.src.includes("sisters-prima-home-desktop") && hd?.src.includes("sisters-dopo-home-desktop") &&
      sp?.src.includes("sisters-prima-scheda") && sd?.src.includes("sisters-dopo-scheda"),
    "slider: prima a sinistra, dopo a destra, in tutti e due",
  );

  // lo slider della home occupa tutta la colonna, quello della scheda resta stretto
  const larghezze = await page.$$eval(".ba__quadro", (q) => q.map((el) => Math.round(el.getBoundingClientRect().width)));
  const colonna = await page.$eval(".caso__corpo", (el) => Math.round(el.getBoundingClientRect().width));
  atteso(
    larghezze[0] >= colonna - 2 && larghezze[1] <= 320,
    `slider: home a tutta colonna, scheda stretta (${larghezze.join(", ")} su ${colonna})`,
  );
  await page.close();
}

/* ---------- Tilt delle card (C3) ---------- */
{
  const { page } = await nuovaPagina(1280);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(1200);

  const tilt = page.locator("[data-tilt]").first();
  await tilt.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const leggi = () => tilt.evaluate((el) => getComputedStyle(el).transform);
  const riposo = await leggi();
  const box = await tilt.boundingBox();

  await page.mouse.move(box.x + box.width * 0.12, box.y + box.height * 0.15);
  await page.waitForTimeout(600);
  const angoloA = await leggi();

  await page.mouse.move(box.x + box.width * 0.88, box.y + box.height * 0.85);
  await page.waitForTimeout(600);
  const angoloB = await leggi();

  atteso(riposo !== angoloA, "tilt: la card si inclina sotto il puntatore");
  atteso(angoloA !== angoloB, "tilt: l'inclinazione cambia col lato della card");
  await page.close();
}

/* ---------- Card che si espande: nomi di transizione condivisi (C4) ---------- */
{
  const nomi = async (url, sel) => {
    const { page } = await nuovaPagina(1280);
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    const out = await page.evaluate(
      (s) =>
        [...document.querySelectorAll(s)]
          .map((el) => getComputedStyle(el).viewTransitionName)
          .filter((n) => n && n !== "none"),
      sel,
    );
    await page.close();
    return out;
  };

  const lista = await nomi("/", ".progetti__cover, .progetti__titolo");
  const dettaglio = await nomi("/progetti/sisters-store", ".caso__cover, .caso__titolo");
  const comuni = lista.filter((n) => dettaglio.includes(n));

  atteso(
    comuni.includes("cover-sisters-store") && comuni.includes("titolo-sisters-store"),
    `card che si espande: cover e titolo condividono il nome di transizione (${comuni.join(", ")})`,
  );
}

/* ---------- View Transitions: il percorso scelto sopravvive ---------- */
{
  const { page, errori } = await nuovaPagina(1280, "business");
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(1200);

  atteso(
    (await page.getAttribute("html", "data-target")) === "business",
    "view transitions: si parte dal percorso business",
  );

  await page.locator('.progetti__cella a[href="/progetti/sisters-store"]').click();
  await page.waitForURL("**/progetti/sisters-store");
  await page.waitForTimeout(900);

  atteso(
    (await page.getAttribute("html", "data-target")) === "business",
    "view transitions: dopo la navigazione il percorso resta business",
  );
  atteso(
    (await page.locator("h1.caso__titolo").count()) === 1,
    "view transitions: la pagina di dettaglio è montata",
  );

  // tornando indietro l'hero deve ripartire, non restare morto
  await page.goBack();
  await page.waitForTimeout(1200);
  atteso(
    (await page.getAttribute("html", "data-target")) === "business",
    "view transitions: tornando in home il percorso è ancora business",
  );
  const heroVivo = await page.evaluate(() => {
    const riga = document.querySelector('.hero__riga--business');
    return !!riga && getComputedStyle(riga).display !== "none";
  });
  atteso(heroVivo, "view transitions: in home l'hero mostra ancora la riga business");

  atteso(errori.length === 0, "view transitions: nessun errore in console");
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await page.close();
}

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche progetti passate");
}
