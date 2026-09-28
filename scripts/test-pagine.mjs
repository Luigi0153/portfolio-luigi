/*
  Verifica delle pagine di Fase 5 a 390 e 1280:
  - /come-lavoro: i 4 passi nell'ordine, i gruppi dello stack, il copy che
    cambia col percorso scelto;
  - /contatti: form accessibile, validazione con focus sul primo errore,
    live region dell'esito, link esterni con rel e avviso;
  - /404: titolo e vie d'uscita;
  - SEO: robots.txt, sitemap, canonical e og:image di ogni pagina.
  Uso: node scripts/test-pagine.mjs   (server su BASE_URL o :4321)
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

/** Nessuna pagina deve scrollare in orizzontale, a nessuna larghezza. */
const senzaOverflow = (page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  );

/**
 * I livelli dei titoli non devono saltare (h1 → h3 senza h2 in mezzo).
 * Conta solo i titoli visibili: le varianti del percorso non scelto sono
 * display:none, quindi non esistono nemmeno per uno screen reader.
 */
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

/* ---------- /come-lavoro ---------- */
for (const vp of [390, 1280]) {
  const { page, errori } = await nuovaPagina(vp);
  await page.goto(BASE + "/come-lavoro", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(900);

  const passi = await page.locator(".processo__nome").allTextContents();
  atteso(
    passi.join(" → ") === "Ci conosciamo → Guardo i numeri → Prototipo → Online",
    `${vp}px come-lavoro: i 4 passi nell'ordine giusto (${passi.join(", ")})`,
  );

  const gruppi = await page.locator(".stack__gruppo-titolo").allTextContents();
  atteso(
    gruppi.length === 4 && gruppi[0] === "E-commerce",
    `${vp}px come-lavoro: i 4 gruppi dello stack`,
  );

  atteso(
    (await page.locator(".stack__voci .tag").count()) >= 12,
    `${vp}px come-lavoro: i tag dello stack sono renderizzati`,
  );

  atteso(await gerarchiaTitoli(page), `${vp}px come-lavoro: gerarchia dei titoli senza salti`);
  atteso(await senzaOverflow(page), `${vp}px come-lavoro: nessun overflow orizzontale`);

  // Tutto ciò che entra con GSAP deve finire visibile, non restare a opacity 0
  await page.evaluate(async () => {
    const passo = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  await page.waitForTimeout(700);
  const invisibili = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.9,
      ).length,
  );
  atteso(invisibili === 0, `${vp}px come-lavoro: tutte le entrate arrivano a opacità piena`);

  atteso(errori.length === 0, `${vp}px come-lavoro: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await page.close();
}

/* Il copy del percorso cambia davvero */
for (const target of ["dev", "business"]) {
  const { page } = await nuovaPagina(1280, target);
  await page.goto(BASE + "/come-lavoro", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const visibile = await page.evaluate(() => {
    const cta = [...document.querySelectorAll(".quinto__cta [data-only]")].find(
      (el) => el.offsetParent !== null,
    );
    return cta?.textContent?.trim() ?? "";
  });
  const atteso_ = target === "dev" ? "Parliamo di codice" : "Parliamo del tuo negozio";
  atteso(visibile === atteso_, `come-lavoro ${target}: la CTA dice "${atteso_}"`);
  await page.close();
}

/* ---------- /contatti ---------- */
for (const vp of [390, 1280]) {
  const { page, errori } = await nuovaPagina(vp);
  await page.goto(BASE + "/contatti", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(900);

  // Ogni campo ha un'etichetta vera, collegata
  const campiEtichettati = await page.evaluate(() =>
    ["nome", "email", "messaggio"].every((n) => {
      const el = document.querySelector(`[name="${n}"]`);
      const label = el && document.querySelector(`label[for="${el.id}"]`);
      return Boolean(label && label.textContent.trim());
    }),
  );
  atteso(campiEtichettati, `${vp}px contatti: i tre campi hanno un'etichetta collegata`);

  atteso(
    (await page.locator("[data-esito][aria-live]").count()) === 1,
    `${vp}px contatti: l'esito è una live region`,
  );

  // Il form senza JS avrebbe la validazione nativa: con JS passa alla nostra
  atteso(
    await page.evaluate(() => document.querySelector(".modulo__form")?.noValidate === true),
    `${vp}px contatti: novalidate messo dallo script, non nell'HTML`,
  );

  // Invio a vuoto: errori inline e focus sul primo campo sbagliato
  await page.locator('.modulo__form button[type="submit"]').click();
  await page.waitForTimeout(300);

  const erroriMostrati = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-errore-per]")].filter(
        (el) => el.textContent.trim() !== "",
      ).length,
  );
  atteso(erroriMostrati === 3, `${vp}px contatti: tre errori inline a form vuoto`);

  atteso(
    await page.evaluate(() => document.activeElement?.getAttribute("name") === "nome"),
    `${vp}px contatti: il focus va sul primo campo sbagliato`,
  );

  atteso(
    await page.evaluate(
      () => document.querySelector('[name="nome"]')?.getAttribute("aria-invalid") === "true",
    ),
    `${vp}px contatti: il campo sbagliato è marcato aria-invalid`,
  );

  // L'errore se ne va mentre correggi, non al prossimo invio
  await page.locator('[name="nome"]').fill("Luigi");
  await page.waitForTimeout(200);
  atteso(
    await page.evaluate(
      () => document.querySelector('[data-errore-per="nome"]')?.textContent.trim() === "",
    ),
    `${vp}px contatti: l'errore sparisce mentre correggi`,
  );

  // Email non valida: resta segnalata
  await page.locator('[name="email"]').fill("non-una-email");
  await page.locator('[name="messaggio"]').fill("Due righe di prova.");
  await page.locator('.modulo__form button[type="submit"]').click();
  await page.waitForTimeout(300);
  atteso(
    await page.evaluate(
      () => document.querySelector('[data-errore-per="email"]')?.textContent.trim() !== "",
    ),
    `${vp}px contatti: l'email non valida viene segnalata`,
  );

  // I link esterni si aprono in scheda nuova, con rel e avviso per chi non vede
  const esterni = await page.evaluate(() =>
    [...document.querySelectorAll('.canali__social a[target="_blank"]')].map((a) => ({
      rel: a.getAttribute("rel") ?? "",
      avviso: a.textContent.includes("nuova scheda"),
    })),
  );
  atteso(
    esterni.length === 2 &&
      esterni.every((e) => e.rel.includes("noopener") && e.avviso),
    `${vp}px contatti: i due link esterni hanno rel e avviso`,
  );

  atteso(
    (await page.locator('a[href^="mailto:"]').count()) >= 1,
    `${vp}px contatti: c'è il link mailto`,
  );

  atteso(await gerarchiaTitoli(page), `${vp}px contatti: gerarchia dei titoli senza salti`);
  atteso(await senzaOverflow(page), `${vp}px contatti: nessun overflow orizzontale`);

  atteso(errori.length === 0, `${vp}px contatti: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await page.close();
}

/* ---------- /404 ---------- */
for (const vp of [390, 1280]) {
  const { page, errori } = await nuovaPagina(vp);
  await page.goto(BASE + "/404", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  atteso(
    (await page.locator("h1").count()) === 1,
    `${vp}px 404: un solo h1`,
  );
  atteso(
    (await page.locator('a[href="/"]').count()) >= 1,
    `${vp}px 404: c'è la via d'uscita verso la home`,
  );
  atteso(
    await page.evaluate(
      () => document.querySelector('meta[name="robots"]')?.content?.includes("noindex") === true,
    ),
    `${vp}px 404: è noindex`,
  );
  atteso(await senzaOverflow(page), `${vp}px 404: nessun overflow orizzontale`);
  atteso(errori.length === 0, `${vp}px 404: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await page.close();
}

/* ---------- Pagine progetto per percorso ---------- */
const SINTESI =
  "Da giugno a luglio gli ordini sono passati da 19 a 31 e il fatturato è cresciuto dell'86%.";
const INVITO = {
  dev: {
    riga: "Cerchi uno sviluppatore per il tuo team o per un progetto? Scrivimi, ti rispondo io.",
    bottone: "Scrivimi",
  },
  business: {
    riga: "Dimmi cosa vendi e a chi. Lo costruiamo insieme, e dopo il lancio resto al tuo fianco.",
    bottone: "Parliamone",
  },
};

for (const vp of [390, 1280]) {
  for (const target of ["dev", "business"]) {
    const { page, errori } = await nuovaPagina(vp, target);
    await page.goto(BASE + "/progetti/caso-reale", { waitUntil: "networkidle" });
    const etichetta = `${vp}px ${target} caso reale`;

    const p = await page.evaluate(() => {
      const visibili = (sel) =>
        [...document.querySelectorAll(sel)].filter((el) => el.getClientRects().length > 0);
      const testo = (el) => el.textContent.replace(/\s+/g, " ").trim();
      const sintesi = visibili(".caso__sintesi");
      const link = sintesi[0]?.querySelector("a");
      return {
        sintesi: sintesi.map(testo),
        link: link ? { testo: testo(link), href: link.getAttribute("href") } : null,
        // La sintesi sta nell'intestazione, subito sotto il titolo
        sottoTitolo: sintesi[0]?.previousElementSibling?.matches("h1") ?? false,
        invitoTitoli: visibili(".invito h2").map(testo),
        invitoRiga: visibili(".invito__riga").map(testo),
        invitoBottone: visibili(".invito .btn").map(testo),
      };
    });

    // getByRole esclude quello che è nascosto agli screen reader
    const linkAccessibili = await page.getByRole("link", { name: "Vai al risultato" }).count();

    if (target === "business" && vp >= 1024) {
      // Da 1024 le tessere del Contesto, con gli stessi numeri, stanno accanto
      atteso(
        p.sintesi.length === 0 && linkAccessibili === 0,
        `${etichetta}: da 1024 la riga di sintesi è nascosta, anche agli screen reader`,
      );
    } else if (target === "business") {
      atteso(
        p.sintesi.length === 1 && p.sintesi[0].startsWith(SINTESI) && p.sottoTitolo,
        `${etichetta}: riga di sintesi sotto il titolo`,
      );
      atteso(linkAccessibili === 1, `${etichetta}: il link è raggiungibile dagli screen reader`);
      atteso(
        p.link?.testo === "Vai al risultato" && p.link.href === "#sez-risultato",
        `${etichetta}: link "Vai al risultato" verso #sez-risultato`,
      );
      await page.getByRole("link", { name: "Vai al risultato" }).click();
      await page.waitForTimeout(800);
      const arrivo = await page.evaluate(() => {
        const r = document.querySelector("#sez-risultato").getBoundingClientRect();
        return r.top >= 0 && r.top < window.innerHeight / 2;
      });
      atteso(arrivo, `${etichetta}: il link porta al capitolo Risultato`);
    } else {
      atteso(p.sintesi.length === 0, `${etichetta}: nessuna riga di sintesi`);
    }

    atteso(
      p.invitoTitoli.length === 1 &&
        p.invitoTitoli[0] === "Raccontami il progetto" &&
        p.invitoRiga.join() === INVITO[target].riga &&
        p.invitoBottone.join() === INVITO[target].bottone,
      `${etichetta}: invito con un solo titolo, riga e bottone del percorso (${p.invitoBottone.join()})`,
    );
    atteso(await senzaOverflow(page), `${etichetta}: nessun overflow orizzontale`);
    atteso(errori.length === 0, `${etichetta}: nessun errore in console`);
    if (errori.length) console.error("   ", errori.slice(0, 3));
    await page.close();
  }
}

// Il confine della riga di sintesi: visibile a 1023, nascosta a 1024
for (const [vp, visibile] of [
  [1023, true],
  [1024, false],
]) {
  const { page } = await nuovaPagina(vp, "business");
  await page.goto(BASE + "/progetti/caso-reale", { waitUntil: "domcontentloaded" });
  const n = await page.getByRole("link", { name: "Vai al risultato" }).count();
  atteso(
    n === (visibile ? 1 : 0),
    `${vp}px business caso reale: riga di sintesi ${visibile ? "visibile" : "nascosta"}`,
  );
  await page.close();
}

// Le description delle pagine progetto sono i sommari del percorso dev
{
  const { page } = await nuovaPagina(1280);
  const DESCRIPTION = {
    "/progetti/caso-reale":
      "Boutique di borse e accessori. Prima due mesi di dati, poi quattro interventi su Shopify, con il redesign in pausa.",
    "/progetti/fornace-vietri":
      "Concept Shopify per un laboratorio di ceramica. Pezzi unici con giacenza 1, tre stati del prodotto e collezioni automatiche.",
    "/progetti/pizzeria":
      "Concept di una landing page per una pizzeria. Prenotazione con un messaggio WhatsApp già scritto, senza portale né gestionale.",
  };
  for (const [percorso, attesa] of Object.entries(DESCRIPTION)) {
    await page.goto(BASE + percorso, { waitUntil: "domcontentloaded" });
    const meta = await page.evaluate(() => ({
      description: document.querySelector('meta[name="description"]')?.content,
      og: document.querySelector('meta[property="og:description"]')?.content,
    }));
    atteso(
      meta.description === attesa && meta.og === attesa,
      `seo: ${percorso} ha la description del sommario dev`,
    );
  }
  await page.close();
}

/* ---------- SEO ---------- */
{
  const { page } = await nuovaPagina(1280);

  const robots = await page.goto(BASE + "/robots.txt");
  const testoRobots = await robots.text();
  atteso(
    testoRobots.includes("Sitemap:") && testoRobots.includes("Disallow: /styleguide"),
    "seo: robots.txt ha la sitemap ed esclude la styleguide",
  );

  const sitemap = await page.goto(BASE + "/sitemap-0.xml");
  const testoSitemap = await sitemap.text();
  const conta = (s) => (testoSitemap.match(new RegExp(s, "g")) ?? []).length;
  // Le pagine dei singoli loghi crescono con la collection: si contano a parte.
  const dettagliLoghi = conta("/loghi/[a-z0-9-]+/");
  atteso(
    conta("<loc>") - dettagliLoghi === 7 &&
      dettagliLoghi >= 4 &&
      !testoSitemap.includes("styleguide"),
    `seo: la sitemap elenca le 7 pagine pubbliche, ${dettagliLoghi} loghi e non la styleguide (${conta("<loc>")})`,
  );

  // Ogni pagina ha canonical e og:image propria
  for (const percorso of [
    "/",
    "/come-lavoro",
    "/contatti",
    "/progetti/caso-reale",
    "/loghi",
    "/loghi/fornace-vietri",
  ]) {
    await page.goto(BASE + percorso, { waitUntil: "domcontentloaded" });
    const meta = await page.evaluate(() => ({
      canonical: document.querySelector("link[rel=canonical]")?.getAttribute("href") ?? "",
      og: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
      titolo: document.title,
    }));
    atteso(
      meta.canonical.startsWith("http") && meta.og.startsWith("http") && meta.titolo !== "",
      `seo: ${percorso} ha canonical, og:image e title (${meta.og.split("/").pop()})`,
    );
  }

  await page.close();
}

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche pagine passate");
}
