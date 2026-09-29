/*
  Verifica del carosello dei loghi in home, a 390 (touch) e 1280:
  - la fila scorre con un'animazione CSS su transform, senza librerie;
  - la fila è duplicata quanto basta a coprire lo schermo, in ogni istante,
    anche dopo un trascinamento; le copie sono aria-hidden e i loro link hanno
    tabindex="-1", i loghi originali no;
  - si ferma al passaggio del mouse, al focus da tastiera e al tocco, e riparte;
  - si trascina con il mouse e con il dito, poi riprende da dove è stato
    lasciato; dopo un trascinamento il clic non apre il logo, un clic normale sì;
  - con prefers-reduced-motion resta fermo, senza copie, e scorre a mano;
  - senza JavaScript resta fermo e si vede tutta la fila;
  - nessuno spostamento di layout (CLS 0) e immagini fuori schermo in lazy.
  Uso: node scripts/test-carosello.mjs   (server su BASE_URL o :4321)
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

/* 390 come un telefono vero: touch e niente hover. */
const VIEWPORT = [
  { w: 390, h: 844, touch: true },
  { w: 1280, h: 800, touch: false },
];

const nuovoContesto = (vp, opzioni = {}) =>
  browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    hasTouch: vp.touch,
    isMobile: vp.touch,
    ...opzioni,
  });

/** Apre la home e porta il carosello in vista. Registra i layout shift. */
const apri = async (context) => {
  const page = await context.newPage();
  const errori = [];
  page.on("pageerror", (e) => errori.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errori.push(m.text()));
  await page.addInitScript(() => {
    // Totale della pagina e solo la parte che tocca la striscia dei loghi:
    // il resto della home (hero) non dipende dal carosello.
    window.__cls = 0;
    window.__clsStriscia = 0;
    new PerformanceObserver((lista) => {
      for (const v of lista.getEntries()) {
        if (v.hadRecentInput) continue;
        window.__cls += v.value;
        if (v.sources.some((src) => src.node?.parentElement?.closest(".striscia"))) {
          window.__clsStriscia += v.value;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.locator("[data-carosello]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  return { page, errori };
};

/** Traslazione orizzontale totale (trascinamento + animazione) della fila. */
const posizione = (page) =>
  page.evaluate(() => {
    const x = (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
    return x(document.querySelector("[data-trascina]")) + x(document.querySelector("[data-pista]"));
  });

const statoAnimazione = (page) =>
  page.evaluate(() => {
    const pista = document.querySelector("[data-pista]");
    const c = getComputedStyle(pista);
    return {
      nome: c.animationName,
      durata: parseFloat(c.animationDuration),
      stato: c.animationPlayState,
      tipo: c.animationIterationCount,
    };
  });

/** Ferma davvero? Stato in pausa e posizione che non cambia in mezzo secondo. */
const fermo = async (page) => {
  await page.waitForTimeout(100);
  const stato = (await statoAnimazione(page)).stato;
  const a = await posizione(page);
  await page.waitForTimeout(500);
  const b = await posizione(page);
  if (stato !== "paused" || Math.abs(a - b) >= 0.5) {
    console.error(`   (stato ${stato}, spostamento ${(b - a).toFixed(1)}px)`);
  }
  return stato === "paused" && Math.abs(a - b) < 0.5;
};

/** Immobile? La posizione non cambia in mezzo secondo (a prescindere dallo stato). */
const immobile = async (page) => {
  const a = await posizione(page);
  await page.waitForTimeout(500);
  return Math.abs(a - (await posizione(page))) < 0.5;
};

/** Scorre davvero? La posizione cambia in mezzo secondo. */
const scorre = async (page) => {
  const a = await posizione(page);
  await page.waitForTimeout(500);
  const b = await posizione(page);
  return Math.abs(a - b) > 3;
};

/** La fila copre l'intera vista: a sinistra e a destra c'è sempre un riquadro. */
const copreLaVista = (page) =>
  page.evaluate(() => {
    const vista = document.querySelector("[data-vista]").getBoundingClientRect();
    const tile = [...document.querySelectorAll("[data-carosello] .logo")].map((li) =>
      li.getBoundingClientRect(),
    );
    const sinistra = Math.min(...tile.map((r) => r.left));
    const destra = Math.max(...tile.map((r) => r.right));
    // Senza buchi: ogni punto della vista sta dentro un riquadro o nello spazio tra due riquadri
    return sinistra <= vista.left + 12 && destra >= vista.right - 12;
  });

/* ---------- Con JavaScript, movimento normale ---------- */
for (const vp of VIEWPORT) {
  const context = await nuovoContesto(vp);
  const { page, errori } = await apri(context);
  const etichetta = `${vp.w}px`;

  const dati = await page.evaluate(() => {
    const radice = document.querySelector("[data-carosello]");
    const originali = [...radice.querySelectorAll("[data-insieme] .logo")];
    const copie = [...radice.querySelectorAll("[data-copia]")];
    const vista = radice.querySelector("[data-vista]");
    const W = radice.querySelector("[data-insieme]").getBoundingClientRect().width;
    return {
      animato: radice.classList.contains("is-animato"),
      originali: originali.length,
      linkOriginali: radice.querySelectorAll("[data-insieme] a").length,
      originaliNascosti: radice.querySelectorAll("[data-insieme] [aria-hidden='true'].logo, [data-insieme][aria-hidden]").length,
      originaliConTabindex: radice.querySelectorAll("[data-insieme] a[tabindex]").length,
      copie: copie.length,
      copieNascoste: copie.every((c) => c.getAttribute("aria-hidden") === "true"),
      linkCopie: copie.flatMap((c) => [...c.querySelectorAll("a")]),
      linkCopieSenzaTabindex: copie.flatMap((c) => [...c.querySelectorAll("a")]).filter(
        (a) => a.getAttribute("tabindex") !== "-1",
      ).length,
      nomiDiTransizioneDuplicati: (() => {
        const scope = [...radice.querySelectorAll("[data-astro-transition-scope]")].map((e) =>
          e.getAttribute("data-astro-transition-scope"),
        );
        return scope.length - new Set(scope).size;
      })(),
      insiemiNecessari: 2 + Math.ceil(vista.clientWidth / W),
      W,
      lazy: [...radice.querySelectorAll("img")].every((i) => i.loading === "lazy"),
      link: [...radice.querySelectorAll("[data-insieme] a")].map((a) => a.getAttribute("href")),
    };
  });

  atteso(dati.animato, `${etichetta}: il carosello è animato`);
  atteso(dati.originali === 4, `${etichetta}: quattro loghi nella fila (${dati.originali})`);
  atteso(
    dati.copie + 1 === dati.insiemiNecessari,
    `${etichetta}: ${dati.copie + 1} file per riempire lo schermo (servono ${dati.insiemiNecessari}, ogni fila è ${Math.round(dati.W)}px)`,
  );
  atteso(
    dati.copieNascoste && dati.linkCopie.length === dati.copie * 4 && dati.linkCopieSenzaTabindex === 0,
    `${etichetta}: copie aria-hidden, con i link a tabindex="-1"`,
  );
  atteso(
    dati.originaliNascosti === 0 && dati.originaliConTabindex === 0 && dati.linkOriginali === 4,
    `${etichetta}: i quattro loghi originali sono raggiungibili da tastiera e screen reader`,
  );
  atteso(
    dati.nomiDiTransizioneDuplicati === 0,
    `${etichetta}: nessun nome di transizione duplicato nelle copie`,
  );
  atteso(dati.lazy, `${etichetta}: tutte le immagini in lazy`);

  const anim = await statoAnimazione(page);
  atteso(
    anim.nome !== "none" && anim.durata > 0 && anim.tipo === "infinite",
    `${etichetta}: animazione CSS in loop continuo (${anim.nome}, ${anim.durata.toFixed(1)}s)`,
  );
  atteso(await scorre(page), `${etichetta}: la fila si muove`);

  // La vista è sempre coperta, in cinque istanti del giro
  let coperta = true;
  for (let i = 0; i < 5; i++) {
    coperta = coperta && (await copreLaVista(page));
    await page.waitForTimeout((dati.W / 40 / 5) * 1000);
  }
  atteso(coperta, `${etichetta}: la vista è sempre piena, per tutto il giro`);

  // Focus da tastiera: si ferma; via il focus, riparte
  await page.locator("[data-insieme] a").first().focus({ timeout: 2000 });
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  const focusVisibile = await page.evaluate(
    () => document.activeElement?.matches(":focus-visible") && document.activeElement.closest("[data-insieme]") !== null,
  );
  atteso(focusVisibile, `${etichetta}: il focus da tastiera arriva su un logo originale`);
  atteso(
    (await fermo(page)),
    `${etichetta}: al focus da tastiera si ferma`,
  );
  atteso(await copreLaVista(page), `${etichetta}: dopo il focus la vista è ancora piena`);
  await page.evaluate(() => document.activeElement.blur());
  await page.mouse.move(1, 1);
  atteso(await scorre(page), `${etichetta}: senza focus riparte`);

  // Tab attraverso i quattro loghi: solo gli originali, mai le copie
  await page.locator("[data-insieme] a").first().focus();
  const visitati = [];
  for (let i = 0; i < 4; i++) {
    visitati.push(
      await page.evaluate(() => ({
        href: document.activeElement.getAttribute("href"),
        copia: Boolean(document.activeElement.closest("[data-copia]")),
      })),
    );
    await page.keyboard.press("Tab");
  }
  atteso(
    visitati.every((v) => !v.copia) && visitati.map((v) => v.href).join() === dati.link.join(),
    `${etichetta}: con Tab si passano i quattro loghi originali, mai le copie`,
  );
  await page.evaluate(() => document.activeElement.blur());
  atteso(await copreLaVista(page), `${etichetta}: dopo la tastiera la vista è ancora piena`);

  if (!vp.touch) {
    // Mouse sopra: si ferma; fuori: riparte
    const riquadro = await page.locator("[data-insieme] .logo").nth(1).boundingBox();
    await page.mouse.move(riquadro.x + riquadro.width / 2, riquadro.y + riquadro.height / 2);
    atteso(
      (await fermo(page)),
      `${etichetta}: al passaggio del mouse si ferma`,
    );
    await page.mouse.move(1, 1);
    atteso(await scorre(page), `${etichetta}: senza il mouse riparte`);

    // Trascinamento con il mouse: segue il puntatore, poi riprende da dove è stato lasciato
    const vista = await page.locator("[data-vista]").boundingBox();
    const y = vista.y + vista.height / 2;
    await page.mouse.move(vista.x + 500, y);
    await page.waitForTimeout(100);
    const prima = await posizione(page);
    await page.mouse.down();
    await page.mouse.move(vista.x + 500 - 60, y, { steps: 6 });
    await page.mouse.move(vista.x + 500 - 220, y, { steps: 10 });
    const durante = await posizione(page);
    atteso(
      Math.abs(durante - prima - -220) < 8,
      `${etichetta}: il mouse trascina la fila (${Math.round(durante - prima)}px per 220px di trascinamento)`,
    );
    atteso(
      (await page.evaluate(() => document.querySelector("[data-carosello]").classList.contains("is-trascinato"))) &&
        (await copreLaVista(page)),
      `${etichetta}: durante il trascinamento la vista resta piena`,
    );
    await page.mouse.up();
    const url = page.url();
    await page.waitForTimeout(200);
    atteso(page.url() === url, `${etichetta}: dopo un trascinamento il clic non apre il logo`);
    const lasciato = await posizione(page);
    // Il mouse è ancora sopra: fermo dov'è. Poi lo si toglie: riprende da lì.
    atteso(Math.abs(lasciato - durante) < 1, `${etichetta}: rilasciato, resta dove è stato lasciato`);
    await page.mouse.move(1, 1);
    await page.waitForTimeout(150);
    const ripreso = await posizione(page);
    atteso(
      Math.abs(ripreso - lasciato) < 40 && (await scorre(page)),
      `${etichetta}: riprende da dove è stato lasciato (${Math.round(ripreso - lasciato)}px dopo 150ms)`,
    );

    // Trascinare tanto: la fila non finisce mai
    let sempreCoperta = true;
    for (const dx of [900, -1800, 3000]) {
      await page.mouse.move(vista.x + 500, y);
      await page.mouse.down();
      await page.mouse.move(vista.x + 500 + Math.max(-480, Math.min(dx, 700)), y, { steps: 8 });
      await page.mouse.up();
      sempreCoperta = sempreCoperta && (await copreLaVista(page));
    }
    atteso(sempreCoperta, `${etichetta}: trascinando avanti e indietro la fila non finisce mai`);
    await page.mouse.move(1, 1);

    // Un clic normale apre il logo: ci si ferma sopra un riquadro visibile e si clicca
    const bersaglio = await page.evaluate(() => {
      const vista = document.querySelector("[data-vista]").getBoundingClientRect();
      const scelto = [...document.querySelectorAll("[data-carosello] .logo")]
        .map((li) => li.getBoundingClientRect())
        .find((r) => r.left > vista.left + 40 && r.right < vista.right - 40);
      return scelto
        ? { x: scelto.left + scelto.width / 2, y: scelto.top + scelto.height / 2 }
        : null;
    });
    await page.mouse.move(bersaglio.x, bersaglio.y);
    await page.waitForTimeout(150);
    const bersaglioFermo = await page.evaluate(({ x, y }) => {
      const a = document.elementFromPoint(x, y)?.closest("a");
      return a?.getAttribute("href") ?? null;
    }, bersaglio);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(700);
    atteso(
      Boolean(bersaglioFermo) && new URL(page.url()).pathname === bersaglioFermo,
      `${etichetta}: un clic normale apre il logo (${new URL(page.url()).pathname})`,
    );
    await page.goBack({ waitUntil: "networkidle" });
  } else {
    // Tocco e trascinamento col dito, con eventi touch veri (CDP)
    const cdp = await context.newCDPSession(page);
    const vista = await page.locator("[data-vista]").boundingBox();
    const y = vista.y + vista.height / 2;
    const tocco = (tipo, x) =>
      cdp.send("Input.dispatchTouchEvent", {
        type: tipo,
        touchPoints: tipo === "touchEnd" ? [] : [{ x, y, id: 1 }],
      });

    const prima = await posizione(page);
    await tocco("touchStart", 300);
    await page.waitForTimeout(100);
    atteso(
      (await fermo(page)),
      `${etichetta}: al tocco si ferma`,
    );
    for (const x of [280, 250, 220, 180]) {
      await tocco("touchMove", x);
      await page.waitForTimeout(16);
    }
    const durante = await posizione(page);
    atteso(
      Math.abs(durante - prima - -120) < 10,
      `${etichetta}: il dito trascina la fila (${Math.round(durante - prima)}px per 120px)`,
    );
    atteso(await copreLaVista(page), `${etichetta}: durante il trascinamento la vista resta piena`);
    await tocco("touchEnd");
    await page.waitForTimeout(150);
    const ripreso = await posizione(page);
    atteso(
      (await statoAnimazione(page)).stato === "running" &&
        Math.abs(ripreso - durante) < 40 &&
        (await scorre(page)),
      `${etichetta}: rilasciato, riprende da dove è stato lasciato (${Math.round(ripreso - durante)}px dopo 150ms)`,
    );

    // Trascinare verso destra e tanto: la fila non finisce mai
    let sempreCoperta = true;
    for (const [da, a] of [[100, 380], [380, 20], [350, 10], [20, 380]]) {
      await tocco("touchStart", da);
      for (let i = 1; i <= 8; i++) {
        await tocco("touchMove", da + ((a - da) * i) / 8);
        await page.waitForTimeout(16);
      }
      await tocco("touchEnd");
      sempreCoperta = sempreCoperta && (await copreLaVista(page));
    }
    atteso(sempreCoperta, `${etichetta}: trascinando avanti e indietro la fila non finisce mai`);
    atteso(await scorre(page), `${etichetta}: dopo tanti trascinamenti scorre ancora`);
  }

  // Nessuno spostamento di layout
  await page.waitForTimeout(1200);
  const cls = await page.evaluate(() => ({ striscia: window.__clsStriscia, totale: window.__cls }));
  atteso(
    cls.striscia === 0,
    `${etichetta}: CLS della striscia loghi ${cls.striscia} (atteso 0; totale della home ${cls.totale.toFixed(3)})`,
  );
  atteso(
    await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    `${etichetta}: nessun overflow orizzontale`,
  );
  atteso(errori.length === 0, `${etichetta}: nessun errore in console`);
  if (errori.length) console.error("   ", errori.slice(0, 3));
  await context.close();
}

/* ---------- Il loop non ha salti ---------- */
/* Su una pagina a parte: play() e pause() dall'API scavalcano la pausa CSS. */
for (const vp of VIEWPORT) {
  const context = await nuovoContesto(vp);
  const { page } = await apri(context);
  const salto = await page.evaluate(() => {
    const anim = document.querySelector("[data-pista]").getAnimations()[0];
    const primo = document.querySelector("[data-insieme] .logo");
    const leggi = (t) => {
      anim.pause();
      anim.currentTime = t;
      return primo.getBoundingClientRect().left;
    };
    const durata = anim.effect.getComputedTiming().duration;
    const W = parseFloat(getComputedStyle(document.querySelector("[data-pista]")).getPropertyValue("--w"));
    const fine = leggi(durata - 0.01); // subito prima del riavvolgimento
    const inizio = leggi(0);
    return { W, scatto: Math.abs(fine - (inizio - W)) };
  });
  atteso(
    salto.scatto < 0.5,
    `${vp.w}px: nessun salto quando il loop ricomincia (${salto.scatto.toFixed(2)}px su una fila di ${Math.round(salto.W)}px)`,
  );
  await context.close();
}

/* ---------- Altezza della sezione stabile quando lo script duplica la fila ---------- */
for (const vp of VIEWPORT) {
  const context = await nuovoContesto(vp, { javaScriptEnabled: false });
  const senza = await context.newPage();
  await senza.goto(BASE + "/", { waitUntil: "load" });
  const altezzaSenza = await senza.evaluate(
    () => document.querySelector("[data-carosello]").getBoundingClientRect().height,
  );
  await context.close();

  const contestoJs = await nuovoContesto(vp);
  const { page } = await apri(contestoJs);
  const altezzaCon = await page.evaluate(
    () => document.querySelector("[data-carosello]").getBoundingClientRect().height,
  );
  atteso(
    Math.abs(altezzaSenza - altezzaCon) < 0.5,
    `${vp.w}px: la fila ha la stessa altezza con e senza copie (${altezzaSenza.toFixed(1)} / ${altezzaCon.toFixed(1)}px)`,
  );
  await contestoJs.close();
}

/* ---------- prefers-reduced-motion: fermo, scorre a mano ---------- */
for (const vp of VIEWPORT) {
  const context = await nuovoContesto(vp, { reducedMotion: "reduce" });
  const { page, errori } = await apri(context);
  const etichetta = `${vp.w}px reduced-motion`;

  const d = await page.evaluate(() => {
    const radice = document.querySelector("[data-carosello]");
    const vista = radice.querySelector("[data-vista]");
    const pista = radice.querySelector("[data-pista]");
    const cs = getComputedStyle(pista);
    return {
      animato: radice.classList.contains("is-animato"),
      copie: radice.querySelectorAll("[data-copia]").length,
      animazione: cs.animationName,
      transform: cs.transform,
      overflowX: getComputedStyle(vista).overflowX,
      scorribile: vista.scrollWidth > vista.clientWidth,
      loghi: radice.querySelectorAll(".logo").length,
    };
  });
  atteso(!d.animato && d.animazione === "none", `${etichetta}: nessuna animazione`);
  atteso(d.copie === 0 && d.loghi === 4, `${etichetta}: nessuna copia, solo i quattro loghi`);
  atteso(await immobile(page), `${etichetta}: la fila sta ferma`);
  atteso(d.overflowX === "auto", `${etichetta}: si scorre a mano (overflow-x: ${d.overflowX})`);
  if (vp.w < 768) {
    atteso(d.scorribile, `${etichetta}: a mano si arriva a tutti i loghi (la fila è più larga della vista)`);
    const mano = await page.evaluate(() => {
      const vista = document.querySelector("[data-vista]");
      vista.scrollLeft = 200;
      return vista.scrollLeft;
    });
    atteso(mano > 0, `${etichetta}: scorrimento a mano (scrollLeft ${mano})`);
  }
  // Anche il cambio di preferenza a pagina aperta: si spegne da solo
  const page2 = await (await nuovoContesto(vp)).newPage();
  await page2.goto(BASE + "/", { waitUntil: "networkidle" });
  const primaDelCambio = await page2.evaluate(() =>
    document.querySelector("[data-carosello]").classList.contains("is-animato"),
  );
  await page2.emulateMedia({ reducedMotion: "reduce" });
  await page2.waitForTimeout(300);
  const dopoIlCambio = await page2.evaluate(() => ({
    animato: document.querySelector("[data-carosello]").classList.contains("is-animato"),
    copie: document.querySelectorAll("[data-copia]").length,
  }));
  atteso(
    primaDelCambio && !dopoIlCambio.animato && dopoIlCambio.copie === 0,
    `${etichetta}: se la preferenza cambia a pagina aperta, il carosello si ferma`,
  );
  await page2.emulateMedia({ reducedMotion: "no-preference" });
  await page2.waitForTimeout(300);
  atteso(
    await page2.evaluate(() => document.querySelector("[data-carosello]").classList.contains("is-animato")),
    `${etichetta}: e riparte quando torna a consentire il movimento`,
  );
  atteso(errori.length === 0, `${etichetta}: nessun errore in console`);
  await page2.context().close();
  await context.close();
}

/* ---------- Senza JavaScript ---------- */
{
  const context = await nuovoContesto(VIEWPORT[0], { javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  const d = await page.evaluate(() => {
    const radice = document.querySelector("[data-carosello]");
    const vista = radice.querySelector("[data-vista]");
    return {
      animato: radice.classList.contains("is-animato"),
      copie: radice.querySelectorAll("[data-copia]").length,
      animazione: getComputedStyle(radice.querySelector("[data-pista]")).animationName,
      loghi: radice.querySelectorAll(".logo").length,
      overflowX: getComputedStyle(vista).overflowX,
    };
  });
  atteso(
    !d.animato && d.copie === 0 && d.animazione === "none" && d.loghi === 4 && d.overflowX === "auto",
    "senza JavaScript: fila ferma, quattro loghi, si scorre a mano",
  );
  await context.close();
}

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche del carosello passate");
}
