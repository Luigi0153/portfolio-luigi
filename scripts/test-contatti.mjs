/*
  Verifica di /contatti sulla build di preview, a 390 e 1280:
  - selettore in cima: stesso stato dello switch dell'hero (preselezionato se la
    scelta esiste, altrimenti chiede di scegliere), e cambiarlo aggiorna tutto il sito;
  - percorso "Vuoi vendere online": passi, Indietro che conserva le risposte,
    Invio da tastiera, focus sulla domanda nuova, indicatore annunciato, errori
    a parole, un solo invio alla fine con i campi giusti;
  - percorso "Cerchi uno sviluppatore": canali in evidenza e modulo corto;
  - senza JavaScript: i tre passi in vista insieme e il POST nativo che funziona.
  Le richieste a Formspree sono intercettate e non partono mai davvero.
  Uso: node scripts/test-contatti.mjs   (preview su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const FORMSPREE = "https://formspree.io/f/xkjgoowv";
const browser = await chromium.launch();
let fallimenti = 0;

const ok = (msg) => console.log(`✓ ${msg}`);
const ko = (msg) => {
  fallimenti++;
  console.error(`✗ ${msg}`);
};
const atteso = (cond, msg) => (cond ? ok(msg) : ko(msg));

/** Contesto con Formspree intercettato: ogni richiesta finisce in `inviati`. */
async function apri(vp, { target = null, js = true, risposta = 200 } = {}) {
  const context = await browser.newContext({
    viewport: { width: vp, height: 900 },
    javaScriptEnabled: js,
    reducedMotion: "reduce",
  });
  if (target) await context.addInitScript((t) => localStorage.setItem("target", t), target);
  const inviati = [];
  await context.route("https://formspree.io/**", async (route) => {
    const req = route.request();
    inviati.push({ url: req.url(), tipo: req.headers()["content-type"] ?? "", corpo: req.postData() ?? "" });
    await route.fulfill(
      js
        ? { status: risposta, contentType: "application/json", body: risposta === 200 ? '{"ok":true}' : '{"error":"no"}' }
        : { status: 200, contentType: "text/html", body: "<p>ok</p>" },
    );
  });
  const page = await context.newPage();
  const errori = [];
  page.on("pageerror", (e) => errori.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errori.push(m.text()));
  return { context, page, errori, inviati };
}

/** I campi di una richiesta: multipart (fetch) o urlencoded (POST nativo). */
function campi(richiesta) {
  const campi = {};
  if (richiesta.tipo.includes("multipart")) {
    for (const m of richiesta.corpo.matchAll(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n--/g)) campi[m[1]] = m[2];
  } else {
    for (const [k, v] of new URLSearchParams(richiesta.corpo)) campi[k] = v;
  }
  return campi;
}

const senzaOverflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

const gerarchiaTitoli = (page) =>
  page.evaluate(() => {
    const livelli = [...document.querySelectorAll("h1, h2, h3, h4")]
      .filter((h) => h.getClientRects().length > 0)
      .map((h) => Number(h.tagName[1]));
    let precedente = livelli[0] ?? 1;
    for (const livello of livelli) {
      if (livello > precedente + 1) return false;
      precedente = livello;
    }
    return livelli[0] === 1 && livelli.filter((l) => l === 1).length === 1;
  });

/** Quale percorso si vede, se il selettore chiede di scegliere, quali voci sono premute. */
const stato = (page) =>
  page.evaluate(() => {
    const visibile = (sel) =>
      [...document.querySelectorAll(sel)].some((e) => e.getClientRects().length > 0);
    return {
      dev: visibile('[data-percorso="dev"]'),
      business: visibile('[data-percorso="business"]'),
      invito: visibile(".selettore__invito"),
      premute: [...document.querySelectorAll(".selettore .tswitch__opt")].map((b) =>
        b.getAttribute("aria-pressed"),
      ),
      salvato: localStorage.getItem("target"),
      dataTarget: document.documentElement.dataset.target,
    };
  });

const prepara = async (page, url = "/contatti") => {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(500);
};

/* ============================ Selettore ============================ */
for (const vp of [390, 1280]) {
  const et = `${vp}px selettore`;

  // Nessuna scelta salvata: la pagina la chiede e non mostra nessun percorso
  {
    const { context, page, errori } = await apri(vp);
    await prepara(page);
    const s = await stato(page);
    atteso(
      s.premute.join() === "," && s.invito && !s.dev && !s.business && s.salvato === null,
      `${et}: senza scelta nessuna voce è premuta, la pagina chiede di scegliere e non mostra percorsi`,
    );
    atteso(
      (await page.locator(".selettore .tswitch__opt").allTextContents()).join("|") ===
        "Cerchi uno sviluppatore|Vuoi vendere online",
      `${et}: le due voci sono quelle dello switch dell'hero`,
    );
    atteso(errori.length === 0, `${et}: nessun errore in console senza scelta`);
    await context.close();
  }

  // Scelta salvata: preselezionata, e solo il suo percorso è in vista
  for (const target of ["dev", "business"]) {
    const { context, page } = await apri(vp, { target });
    await prepara(page);
    const s = await stato(page);
    const attese = target === "dev" ? ["true", "false"] : ["false", "true"];
    atteso(
      s.premute.join() === attese.join() &&
        !s.invito &&
        s.dev === (target === "dev") &&
        s.business === (target === "business"),
      `${et}: con "${target}" salvato la voce è preselezionata e si vede solo il suo percorso`,
    );
    await context.close();
  }

  // Scegliere qui aggiorna la scelta per tutto il sito
  {
    const { context, page } = await apri(vp);
    await prepara(page);
    await page.getByRole("button", { name: "Vuoi vendere online" }).click();
    await page.waitForTimeout(300);
    let s = await stato(page);
    atteso(
      s.business && !s.dev && !s.invito && s.salvato === "business" && s.dataTarget === "business",
      `${et}: scegliere "Vuoi vendere online" mostra il modulo e salva la scelta`,
    );

    // …e la home la legge: stessa scelta
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const hero = await page.evaluate(() => ({
      dataTarget: document.documentElement.dataset.target,
      businessVisibile: [...document.querySelectorAll(".hero__riga--business")].some(
        (e) => e.getClientRects().length > 0,
      ),
      premuta: document.querySelector('.hero .tswitch__opt[data-value="business"]')?.getAttribute("aria-pressed"),
    }));
    atteso(
      hero.dataTarget === "business" && hero.businessVisibile && hero.premuta === "true",
      `${et}: la home mostra il percorso scelto in /contatti`,
    );

    // Dalla home si torna ai contatti con "Scrivimi": la scelta c'è ancora
    await page.locator(".site-nav").getByRole("link", { name: "Scrivimi" }).click();
    await page.waitForURL("**/contatti");
    await page.waitForTimeout(500);
    s = await stato(page);
    atteso(s.business && !s.dev && s.premute.join() === "false,true", `${et}: tornando ai contatti dalla nav la scelta resta`);

    // Cambiare qui, di nuovo, aggiorna tutto
    await page.getByRole("button", { name: "Cerchi uno sviluppatore" }).click();
    await page.waitForTimeout(300);
    s = await stato(page);
    atteso(
      s.dev && !s.business && s.salvato === "dev" && s.dataTarget === "dev",
      `${et}: tornare a "Cerchi uno sviluppatore" cambia percorso e scelta salvata`,
    );
    await context.close();
  }

  // Il contrario: scelta fatta nell'hero, preselezionata in /contatti
  {
    const { context, page } = await apri(vp);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.locator(".hero").getByRole("button", { name: "Vuoi vendere online" }).click();
    await page.goto(BASE + "/contatti", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const s = await stato(page);
    atteso(
      s.premute.join() === "false,true" && s.business && !s.dev,
      `${et}: la scelta fatta nell'hero è preselezionata in /contatti`,
    );
    await context.close();
  }
}

/* ============================ Modulo a passi ============================ */
for (const vp of [390, 1280]) {
  const et = `${vp}px passi`;
  const { context, page, errori, inviati } = await apri(vp, { target: "business" });
  await prepara(page);
  const f = page.locator("[data-passi]");

  const passiVisibili = () =>
    f.locator("[data-passo]").evaluateAll((l) => l.map((e) => e.getClientRects().length > 0));
  const indicatore = () => f.locator("[data-indicatore]").textContent().then((t) => t.trim());
  const focusSu = () =>
    page.evaluate(() => {
      const a = document.activeElement;
      return { tag: a?.tagName, testo: a?.tagName === "LEGEND" ? a.textContent.trim() : "", nome: a?.getAttribute("name") };
    });
  const errore = (id) => page.locator(`#${id}`).textContent().then((t) => t.trim());
  const visibile = (sel) => f.locator(sel).first().isVisible();

  // Struttura iniziale
  atteso(
    (await passiVisibili()).join() === "true,false,false" && (await indicatore()) === "1 di 3",
    `${et}: si parte dal passo 1 di 3, gli altri sono nascosti`,
  );
  atteso(
    (await f.locator("[data-indicatore]").getAttribute("aria-live")) === "polite" &&
      (await f.locator("[data-indicatore]").getAttribute("aria-atomic")) === "true",
    `${et}: l'indicatore è annunciato con aria-live`,
  );
  atteso(
    !(await visibile("[data-indietro]")) &&
      (await f.locator("[data-avanti]").textContent()).trim() === "Avanti",
    `${et}: al passo 1 Indietro non c'è e il bottone dice "Avanti"`,
  );
  atteso(
    (await f.locator("legend").first().textContent()).trim() === "Cosa ti serve?" &&
      (await f.locator('input[name="servizio"]').evaluateAll((l) => l.map((e) => e.value))).join("|") ===
        "Negozio online|Sito o landing page|Logo e immagine|Altro",
    `${et}: passo 1 "Cosa ti serve?" con le quattro voci`,
  );
  atteso(!(await visibile('input[name="servizio_altro"]')), `${et}: il campo "Altro" è nascosto finché non serve`);

  // Le voci si toccano bene col dito
  const altezze = await f.locator(".scelta").evaluateAll((l) => l.filter((e) => e.getClientRects().length).map((e) => e.getBoundingClientRect().height));
  atteso(altezze.every((h) => h >= 44), `${et}: le voci a scelta sono alte almeno 44px (${Math.min(...altezze)}px)`);

  // Avanti senza scegliere: errore a parole, resta al passo 1, focus sulla voce
  await f.locator("[data-avanti]").click();
  atteso(
    (await errore("b-servizio-errore")) === "Scegli una delle voci." &&
      (await passiVisibili()).join() === "true,false,false" &&
      (await focusSu()).nome === "servizio",
    `${et}: Avanti senza scegliere spiega l'errore vicino al campo e porta il focus sulla voce`,
  );
  atteso(
    (await f.locator('input[name="servizio"]').first().getAttribute("aria-invalid")) === "true" &&
      ((await f.locator('input[name="servizio"]').first().getAttribute("aria-describedby")) ?? "").includes("b-servizio-errore"),
    `${et}: la voce è aria-invalid e collegata al suo errore`,
  );
  await f.getByLabel("Logo e immagine").check();
  atteso((await errore("b-servizio-errore")) === "", `${et}: l'errore sparisce appena scegli`);

  // "Altro": il campo compare solo se scelto, e senza testo non si passa
  await f.getByLabel("Altro", { exact: true }).check();
  atteso(await visibile('input[name="servizio_altro"]'), `${et}: scegliendo "Altro" compare il campo di testo`);
  await f.locator("[data-avanti]").click();
  atteso(
    (await errore("b-altro-errore")) !== "" && (await focusSu()).nome === "servizio_altro",
    `${et}: "Altro" senza testo segnala l'errore e dà il focus al campo`,
  );
  await f.getByLabel("Altro: scrivi cosa ti serve").fill("Un catalogo in PDF");

  // Invio da tastiera porta avanti, il focus va sulla domanda nuova
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
  let fo = await focusSu();
  atteso(
    (await passiVisibili()).join() === "false,true,false" &&
      (await indicatore()) === "2 di 3" &&
      fo.tag === "LEGEND" &&
      fo.testo === "Hai già un sito o un negozio online?",
    `${et}: Invio porta al passo 2, indicatore "2 di 3", focus sulla domanda nuova`,
  );
  atteso(
    (await visibile("[data-indietro]")) &&
      (await f.locator('input[name="situazione"]').evaluateAll((l) => l.map((e) => e.value))).join("|") ===
        "Sì, va migliorato|No, parto da zero|Ho solo un negozio fisico",
    `${et}: passo 2 con Indietro e le tre voci`,
  );
  atteso(inviati.length === 0, `${et}: dopo due passi non è partito nessun invio`);

  // Passo 2 senza risposta
  await f.locator("[data-avanti]").click();
  atteso(
    (await errore("b-situazione-errore")) !== "" && (await passiVisibili()).join() === "false,true,false",
    `${et}: il passo 2 senza risposta segnala l'errore e non avanza`,
  );
  await f.getByLabel("No, parto da zero").check();

  // Indietro: le risposte restano
  await f.locator("[data-indietro]").click();
  fo = await focusSu();
  atteso(
    (await indicatore()) === "1 di 3" &&
      fo.testo === "Cosa ti serve?" &&
      (await f.getByLabel("Altro", { exact: true }).isChecked()) &&
      (await f.getByLabel("Altro: scrivi cosa ti serve").inputValue()) === "Un catalogo in PDF",
    `${et}: Indietro torna al passo 1 col focus sulla domanda e le risposte al loro posto`,
  );
  await f.locator("[data-avanti]").click();
  atteso(
    (await f.getByLabel("No, parto da zero").isChecked()),
    `${et}: tornando avanti la risposta del passo 2 c'è ancora`,
  );
  await f.locator("[data-avanti]").click();

  // Passo 3
  fo = await focusSu();
  atteso(
    (await indicatore()) === "3 di 3" &&
      fo.testo === "Come ti chiamo e come ti ricontatto?" &&
      (await f.locator("[data-avanti]").textContent()).trim() === "Invia",
    `${et}: passo 3, "3 di 3", il bottone dice "Invia"`,
  );
  atteso(
    !(await visibile('input[name="telefono"]')) && !(await visibile('input[name="email"]')),
    `${et}: telefono ed email compaiono solo dopo la scelta`,
  );
  atteso(
    (await f.locator('.consenso a[href="/privacy"]').count()) === 1,
    `${et}: la casella del consenso ha il link a /privacy`,
  );
  atteso(
    (await page.locator(".passi__diretto").textContent()).includes("Preferisci scrivermi direttamente?") &&
      (await page.locator('.passi__diretto a[href^="mailto:"]').count()) === 1,
    `${et}: sotto il modulo c'è "Preferisci scrivermi direttamente?" con la mail`,
  );

  // Invio a vuoto: tre errori a parole, focus sul primo
  await f.locator("[data-avanti]").click();
  const vuoti = await f.locator("[data-errore-per]").evaluateAll((l) =>
    l.filter((e) => e.textContent.trim() !== "").map((e) => e.dataset.errorePer),
  );
  atteso(
    vuoti.join() === "nome,contatto_preferito,consenso_privacy" && (await focusSu()).nome === "nome",
    `${et}: a passo 3 vuoto: errori su nome, canale e consenso, focus sul nome (${vuoti.join()})`,
  );
  atteso(inviati.length === 0, `${et}: con errori non parte nessun invio`);

  // Telefono: compare il campo giusto, il numero storto è segnalato
  await f.getByLabel("Il tuo nome").fill("Mario Rossi");
  await f.getByLabel("Telefono", { exact: true }).check();
  atteso(
    (await visibile('input[name="telefono"]')) && !(await visibile('input[name="email"]')),
    `${et}: scelto "Telefono" compare solo il campo telefono`,
  );
  await f.getByLabel("Il tuo numero di telefono").fill("abc");
  await f.locator("#b-consenso").check();
  await f.locator("[data-avanti]").click();
  atteso(
    (await errore("b-telefono-errore")) !== "" && (await focusSu()).nome === "telefono",
    `${et}: un numero non valido è segnalato vicino al campo`,
  );

  // Cambio idea: email. L'errore del telefono non deve restare addosso
  await f.getByLabel("Email", { exact: true }).check();
  atteso(
    (await visibile('input[name="email"]')) && !(await visibile('input[name="telefono"]')),
    `${et}: scelta "Email" compare solo il campo email`,
  );
  await f.getByLabel("La tua email").fill("non-una-email");
  await f.locator("[data-avanti]").click();
  atteso((await errore("b-email-errore")) !== "", `${et}: un'email non valida è segnalata`);
  await f.getByLabel("La tua email").fill("mario@example.com");

  // Prima dell'invio cambia "Altro" in un'altra voce: servizio_altro non deve partire
  await f.locator("[data-indietro]").click();
  await f.locator("[data-indietro]").click();
  await f.getByLabel("Negozio online").check();
  await f.locator("[data-avanti]").click();
  await f.locator("[data-avanti]").click();
  await f.locator("[data-avanti]").click();
  await page.waitForTimeout(300);

  atteso(inviati.length === 1 && inviati[0].url === FORMSPREE, `${et}: un solo invio, a Formspree (${inviati.length})`);
  const dati = inviati[0] ? campi(inviati[0]) : {};
  atteso(
    dati.servizio === "Negozio online" &&
      !("servizio_altro" in dati) &&
      dati.situazione === "No, parto da zero" &&
      dati.nome === "Mario Rossi" &&
      dati.contatto_preferito === "Email" &&
      dati.email === "mario@example.com" &&
      !("telefono" in dati) &&
      dati._replyto === "mario@example.com" &&
      dati.percorso === "Vuoi vendere online" &&
      dati.consenso_privacy === "sì",
    `${et}: i campi inviati sono quelli giusti (${Object.keys(dati).join(", ")})`,
  );

  // Conferma: semplice, col focus, senza promettere tempi
  const conferma = await page.locator("[data-conferma]");
  const testoConferma = (await conferma.textContent()).replace(/\s+/g, " ").trim();
  atteso(
    (await conferma.isVisible()) &&
      !(await f.isVisible()) &&
      (await page.evaluate(() => document.activeElement?.hasAttribute("data-conferma"))),
    `${et}: dopo l'invio si vede la conferma, col focus, al posto del modulo`,
  );
  atteso(
    !/entro|ore\b|giorn|minut|subito|presto|24/i.test(testoConferma),
    `${et}: la conferma non promette tempi ("${testoConferma}")`,
  );
  atteso(await gerarchiaTitoli(page), `${et}: gerarchia dei titoli senza salti`);
  atteso(await senzaOverflow(page), `${et}: nessun overflow orizzontale`);
  atteso(errori.length === 0, `${et}: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await context.close();
}

/* Telefono scelto: parte il telefono, non l'email, e non c'è _replyto */
{
  const { context, page, inviati } = await apri(390, { target: "business" });
  await prepara(page);
  const f = page.locator("[data-passi]");
  await f.getByLabel("Sito o landing page").check();
  await f.locator("[data-avanti]").click();
  await f.getByLabel("Ho solo un negozio fisico").check();
  await f.locator("[data-avanti]").click();
  await f.getByLabel("Il tuo nome").fill("Anna");
  await f.getByLabel("Telefono", { exact: true }).check();
  await f.getByLabel("Il tuo numero di telefono").fill("+39 333 123 4567");
  await f.locator("#b-consenso").check();
  await f.locator("[data-avanti]").click();
  await page.waitForTimeout(300);
  const dati = inviati[0] ? campi(inviati[0]) : {};
  atteso(
    inviati.length === 1 &&
      dati.contatto_preferito === "Telefono" &&
      dati.telefono === "+39 333 123 4567" &&
      !("email" in dati) &&
      !("_replyto" in dati) &&
      dati.situazione === "Ho solo un negozio fisico",
    `390px passi: con "Telefono" parte il telefono, senza email né _replyto (${Object.keys(dati).join(", ")})`,
  );
  atteso(
    (await page.locator("[data-conferma-testo]").textContent()).includes("numero"),
    "390px passi: la conferma parla del numero lasciato",
  );
  await context.close();
}

/* Errore di Formspree: niente conferma finta, si può riprovare */
{
  const { context, page, inviati } = await apri(390, { target: "business", risposta: 500 });
  await prepara(page);
  const f = page.locator("[data-passi]");
  await f.getByLabel("Negozio online").check();
  await f.locator("[data-avanti]").click();
  await f.getByLabel("No, parto da zero").check();
  await f.locator("[data-avanti]").click();
  await f.getByLabel("Il tuo nome").fill("Anna");
  await f.getByLabel("Email", { exact: true }).check();
  await f.getByLabel("La tua email").fill("anna@example.com");
  await f.locator("#b-consenso").check();
  await f.locator("[data-avanti]").click();
  await page.waitForTimeout(300);
  atteso(
    inviati.length === 1 &&
      (await f.locator("[data-esito]").getAttribute("role")) === "status" &&
      (await f.locator("[data-esito]").textContent()).includes("Non è partito") &&
      !(await page.locator("[data-conferma]").isVisible()) &&
      (await f.locator("[data-avanti]").isEnabled()),
    "390px passi: se Formspree rifiuta, lo dice, non mostra la conferma e lascia riprovare",
  );
  await context.close();
}

/* ============================ Modulo corto (sviluppatore) ============================ */
for (const vp of [390, 1280]) {
  const et = `${vp}px sviluppatore`;
  const { context, page, errori, inviati } = await apri(vp, { target: "dev" });
  await prepara(page);

  const link = await page.evaluate(() =>
    [...document.querySelectorAll(".canali a")].map((a) => ({
      href: a.getAttribute("href"),
      rel: a.getAttribute("rel") ?? "",
      blank: a.target === "_blank",
      avviso: a.textContent.includes("nuova scheda"),
      y: a.getBoundingClientRect().top + window.scrollY,
    })),
  );
  atteso(
    link.length === 3 &&
      link[0].href === "mailto:luigi4375@gmail.com" &&
      link[1].href === "https://www.linkedin.com/in/luigi-romano-951806377" &&
      link[2].href === "https://github.com/Luigi0153",
    `${et}: in evidenza email, LinkedIn e GitHub con gli indirizzi giusti`,
  );
  atteso(
    link.slice(1).every((l) => l.blank && l.rel.includes("noopener") && l.avviso),
    `${et}: i link esterni hanno rel e avviso per chi non vede`,
  );
  const yForm = await page.locator("[data-corto]").evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
  atteso(link.every((l) => l.y < yForm), `${et}: i canali stanno sopra il modulo`);

  const c = page.locator("[data-corto]");
  atteso(
    (await c.locator("input, textarea").evaluateAll((l) => l.filter((e) => e.name && e.type !== "hidden" && e.name !== "_gotcha").map((e) => e.name))).join() ===
      "nome,email,messaggio,consenso_privacy",
    `${et}: il modulo corto ha nome, email, messaggio e consenso`,
  );
  atteso(
    (await c.locator('.consenso a[href="/privacy"]').count()) === 1,
    `${et}: il consenso rimanda a /privacy`,
  );

  await c.locator('button[type="submit"]').click();
  const vuoti = await c.locator("[data-errore-per]").evaluateAll((l) =>
    l.filter((e) => e.textContent.trim() !== "").map((e) => e.dataset.errorePer),
  );
  atteso(
    vuoti.join() === "nome,email,messaggio,consenso_privacy" &&
      (await page.evaluate(() => document.activeElement?.getAttribute("name"))) === "nome" &&
      inviati.length === 0,
    `${et}: a modulo vuoto quattro errori a parole, focus sul primo, nessun invio`,
  );

  await c.getByLabel("Come ti chiami").fill("Sara Bianchi");
  await c.getByLabel("La tua email").fill("sara@example.com");
  await c.getByLabel("Cosa ti serve").fill("Cerchiamo uno sviluppatore Shopify.");
  await c.locator('button[type="submit"]').click();
  atteso(
    (await c.locator('[data-errore-per="consenso_privacy"]').textContent()).trim() !== "" && inviati.length === 0,
    `${et}: senza consenso il modulo non parte`,
  );
  await c.locator("#d-consenso").check();
  await c.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);
  const dati = inviati[0] ? campi(inviati[0]) : {};
  atteso(
    inviati.length === 1 &&
      inviati[0].url === FORMSPREE &&
      dati.nome === "Sara Bianchi" &&
      dati.email === "sara@example.com" &&
      dati.messaggio === "Cerchiamo uno sviluppatore Shopify." &&
      dati.percorso === "Cerchi uno sviluppatore",
    `${et}: invio a Formspree con il campo percorso (${Object.keys(dati).join(", ")})`,
  );
  atteso(
    (await c.locator("[data-esito]").textContent()) === "Ricevuto. Ti rispondo io.",
    `${et}: esito semplice, senza tempi di risposta`,
  );
  atteso(await gerarchiaTitoli(page), `${et}: gerarchia dei titoli senza salti`);
  atteso(await senzaOverflow(page), `${et}: nessun overflow orizzontale`);
  atteso(errori.length === 0, `${et}: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await context.close();
}

/* ============================ Senza JavaScript ============================ */
{
  const { context, page, inviati } = await apri(390, { js: false });
  await page.goto(BASE + "/contatti", { waitUntil: "load" });
  const f = page.locator("[data-passi]");

  const passi = await f.locator("[data-passo]").evaluateAll((l) => l.map((e) => e.getClientRects().length > 0));
  atteso(passi.join() === "true,true,true", "senza JS: i tre passi compaiono insieme, come un modulo normale");
  atteso(
    !(await page.locator(".selettore").isVisible()) &&
      !(await f.locator(".passi__testa").isVisible()) &&
      !(await f.locator("[data-indietro]").isVisible()),
    "senza JS: selettore, indicatore e Indietro non ci sono (non servono)",
  );
  atteso(
    (await f.locator('input[name="servizio_altro"]').isVisible()) &&
      (await f.locator('input[name="telefono"]').isVisible()) &&
      (await f.locator('input[name="email"]').isVisible()),
    "senza JS: i campi \"Altro\", telefono ed email sono sempre in vista",
  );
  atteso(
    (await f.locator("[data-avanti]").textContent()).trim() === "Invia" &&
      (await page.locator("[data-corto]").isVisible()),
    "senza JS: il bottone dice \"Invia\" e anche il modulo corto è in vista",
  );
  atteso(
    (await f.evaluate((e) => e.noValidate)) === false,
    "senza JS: restano i controlli nativi (novalidate non c'è)",
  );

  // Il POST nativo parte con i campi giusti
  await f.getByLabel("Sito o landing page").check();
  await f.getByLabel("No, parto da zero").check();
  await f.getByLabel("Il tuo nome").fill("Anna");
  await f.getByLabel("Telefono", { exact: true }).check();
  await f.getByLabel("Il tuo numero di telefono").fill("333 1234567");
  await f.locator("#b-consenso").check();
  await f.locator('button[type="submit"]').click();
  await page.waitForTimeout(500);
  const dati = inviati[0] ? campi(inviati[0]) : {};
  atteso(
    inviati.length === 1 &&
      inviati[0].url === FORMSPREE &&
      dati.servizio === "Sito o landing page" &&
      dati.situazione === "No, parto da zero" &&
      dati.nome === "Anna" &&
      dati.contatto_preferito === "Telefono" &&
      dati.telefono === "333 1234567" &&
      dati.percorso === "Vuoi vendere online",
    `senza JS: il POST nativo arriva a Formspree con i campi giusti (${Object.keys(dati).join(", ")})`,
  );
  await context.close();
}

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche dei contatti passate");
}
