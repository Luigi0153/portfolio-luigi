/*
  Verifica della sezione progetti e del case study, a 390 e 1280:
  - lista: tre card, ordine che segue il percorso scelto, nessun "in arrivo",
    copertine fotografiche dei due concept;
  - dettaglio: due colonne con colonna pinnata a 1280, una colonna a 390;
  - concept (Fornace Vietri, pizzeria): riga concept, capitoli in ordine,
    immagini al loro posto, galleria affiancata a 1280 e scorrevole una alla
    volta a 390, og-image;
  - slider prima/dopo guidabile da tastiera;
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
    atteso((await celle.count()) === 3, `${vp}px ${target}: tre card in griglia`);

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
      ordine[0].startsWith("I numeri prima"),
      `${vp}px ${target}: il progetto reale è il primo`,
    );
    const secondo = target === "dev" ? "Fornace Vietri" : "Pizzeria Vico Stretto";
    atteso(ordine[1] === secondo, `${vp}px ${target}: al secondo posto "${secondo}"`);

    // nessun progetto è più "in arrivo"
    const inArrivo = await page.$$eval(".progetti__cella", (celle) =>
      celle.filter((c) => /in arrivo/i.test(c.textContent)).length,
    );
    atteso(inArrivo === 0, `${vp}px ${target}: nessuna card "in arrivo"`);

    // i due concept hanno la copertina fotografica, caricata davvero
    for (const [slug, file] of [
      ["fornace-vietri", "fornace-copertina"],
      ["pizzeria", "pizzeria-copertina"],
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
  await page.goto(BASE + "/progetti/caso-reale", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(1200);

  const sezioni = await page.locator(".caso__sezione-titolo").allTextContents();
  atteso(
    sezioni.join(" | ") === "Contesto | Decisione | Risultato | Cosa ho imparato",
    `${vp}px dettaglio: le quattro sezioni nell'ordine giusto`,
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
    valori.map((v) => v.replace(/\s/g, "")).join(" ") === "+63% +86% 94%",
    `${vp}px dettaglio: i numeri contati arrivano a +63% +86% 94%`,
  );

  atteso(errori.length === 0, `${vp}px dettaglio: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await page.close();
}

/* ---------- Dettaglio dei concept ---------- */
const CONCEPT = [
  {
    slug: "fornace-vietri",
    copertina: "fornace-copertina",
    nota: "Progetto concept. Il laboratorio è inventato, il problema è reale. Le foto sono generate con l'AI.",
    capitoli: ["Il laboratorio", "Il problema", "La decisione", "Il sistema", "Cosa ho imparato", "Nel negozio vero farei"],
    figure: { "fornace-brand": "sez-laboratorio", "fornace-stati": "sez-decisione" },
    elenchi: {},
    galleria: { capitolo: "sez-sistema", schermate: 4 },
  },
  {
    slug: "pizzeria",
    copertina: "pizzeria-copertina",
    nota: "Progetto concept. La pizzeria è inventata, il problema è reale. Le foto sono generate con l'AI.",
    capitoli: ["La pizzeria", "Il problema", "Il flusso", "La decisione", "Cosa ho tolto", "La pagina", "Cosa ho imparato", "Nel locale vero farei"],
    figure: { "pizzeria-brand": "sez-pizzeria", "pizzeria-flusso": "sez-flusso" },
    // capitolo -> tipo di lista e numero di voci
    elenchi: { "sez-flusso": "ol 3", "sez-tolto": "ul 4", "sez-pagina": "ul 4" },
    galleria: { capitolo: "sez-pagina", schermate: 3 },
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

    const senzaOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
    atteso(senzaOverflow, `${vp}px ${slug}: nessun overflow orizzontale della pagina`);

    const og = await page.getAttribute('meta[property="og:image"]', "content");
    const ogRisposta = og ? await page.request.get(BASE + new URL(og).pathname) : null;
    atteso(
      og?.endsWith(`/og/${slug}.png`) && ogRisposta?.ok(),
      `${vp}px ${slug}: og-image presente e servita (${og})`,
    );

    atteso(errori.length === 0, `${vp}px ${slug}: nessun errore in console`);
    if (errori.length) console.error("   ", errori.slice(0, 3));
    await page.close();
  }
}

/* ---------- Slider prima/dopo da tastiera ---------- */
{
  const { page } = await nuovaPagina(1280);
  await page.goto(BASE + "/progetti/caso-reale", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const slider = page.locator(".ba__range");
  await slider.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

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
    () => getComputedStyle(document.querySelector(".ba__img--dopo")).clipPath,
  );
  atteso(clip.includes("%"), `slider: l'immagine "dopo" è tagliata alla posizione (${clip})`);
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
  const dettaglio = await nomi("/progetti/caso-reale", ".caso__cover, .caso__titolo");
  const comuni = lista.filter((n) => dettaglio.includes(n));

  atteso(
    comuni.includes("cover-caso-reale") && comuni.includes("titolo-caso-reale"),
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

  await page.locator('.progetti__cella a[href="/progetti/caso-reale"]').click();
  await page.waitForURL("**/progetti/caso-reale");
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
