/*
  Verifica della nav a pillola alle larghezze critiche (320 → 1280), con
  ciascuna voce attiva e con il telefono ruotato in orizzontale:
  1. la pillola è larga quanto il suo contenuto, centrata, e resta staccata
     almeno 12px da ogni bordo (100% meno 24px);
  2. gli spazi tra le voci crescono con la larghezza ma non si sparpagliano;
  3. il contenuto sta dentro la pillola, il testo non scende sotto i 13px e
     nessuna voce va a capo;
  4. il riempimento ink è esattamente sulla voce attiva;
  5. il marchio è un bersaglio 44x44 con l'SVG da 36 al centro, ha il nome
     nell'aria-label e l'anello ink al focus; il separatore c'è solo da 768;
  6. "Luigi Romano" resta nel titolo, nei meta e nel footer di ogni pagina;
  7. su ogni pagina, aperta direttamente o raggiunta dalla nav, la voce col
     testo cream ha sotto il riempimento con fondo ink (il colore letto dal
     token, non scritto qui), e l'header resta lo stesso nodo tra le pagine.
  Uso: node scripts/test-nav.mjs   (server attivo su BASE_URL o :4321)
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

/* Le tre voci, con la pagina che le rende attive. */
const pagine = [
  { voce: "Come lavoro", url: "/come-lavoro" },
  { voce: "Contatti", url: "/contatti" },
  { voce: "Progetti", url: "/", sezione: "progetti" },
];

/* Ritratto + orizzontale: la rotazione è un resize, non un caricamento. */
const viewport = [
  { w: 320, h: 568, ruota: true },
  { w: 360, h: 740, ruota: true },
  { w: 390, h: 844, ruota: true },
  { w: 430, h: 932, ruota: true },
  { w: 768, h: 1024, ruota: true },
  { w: 1280, h: 800, ruota: false },
];

const misura = (page) =>
  page.evaluate(() => {
    const pill = document.querySelector(".site-nav__pill");
    const thumb = document.querySelector(".site-nav__thumb");
    const links = [...document.querySelectorAll(".site-nav__link")];
    const attivo = links.find((l) => l.hasAttribute("aria-current"));
    const r = (el) => el.getBoundingClientRect();
    const rp = r(pill);
    const rt = r(thumb);
    const vw = document.documentElement.clientWidth;

    // Il contenuto deve stare dentro il riquadro interno della pillola
    const cs = getComputedStyle(pill);
    const bordo = parseFloat(cs.borderLeftWidth);
    const figli = [...pill.children].filter((c) => r(c).width > 0);
    const sbordo = Math.max(
      rp.left + bordo + parseFloat(cs.paddingLeft) - Math.min(...figli.map((c) => r(c).left)),
      Math.max(...figli.map((c) => r(c).right)) - (rp.right - bordo - parseFloat(cs.paddingRight)),
    );

    // Una riga sola per voce: due rettangoli di testo vogliono dire a capo
    const range = document.createRange();
    const righe = links.map((l) => {
      range.selectNodeContents(l);
      return range.getClientRects().length;
    });

    const centro = (b) => b.left + b.width / 2;
    const centroY = (b) => b.top + b.height / 2;
    const logo = pill.querySelector(".site-nav__logo");
    const rl = r(logo);
    const rs = r(logo.querySelector("svg"));
    return {
      logo: {
        w: +rl.width.toFixed(2),
        h: +rl.height.toFixed(2),
        svg: +rs.width.toFixed(2),
        scarto: +Math.max(
          Math.abs(centro(rs) - centro(rl)),
          Math.abs(centroY(rs) - centroY(rl)),
        ).toFixed(2),
        label: logo.getAttribute("aria-label"),
        testo: logo.textContent.trim(),
      },
      sep: getComputedStyle(pill.querySelector(".site-nav__sep")).display !== "none",
      vw,
      sinistra: +rp.left.toFixed(2),
      destra: +(vw - rp.right).toFixed(2),
      larghezza: +rp.width.toFixed(2),
      sbordo: +sbordo.toFixed(2),
      font: parseFloat(getComputedStyle(links[0]).fontSize),
      pad: parseFloat(getComputedStyle(links[0]).paddingLeft),
      righe: Math.max(...righe),
      attivo: attivo?.textContent.trim() ?? null,
      thumbVisibile: Number(getComputedStyle(thumb).opacity) > 0.99,
      scartoCentro: attivo ? +Math.abs(centro(rt) - centro(r(attivo))).toFixed(2) : null,
      scartoLarghezza: attivo ? +Math.abs(rt.width - r(attivo).width).toFixed(2) : null,
      overflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

const verifica = (m, etichetta, voce) => {
  const mobile = m.vw < 768;
  atteso(
    m.sinistra >= 11.5 && m.destra >= 11.5,
    `${etichetta}: la pillola resta staccata dai bordi (${m.sinistra} / ${m.destra})`,
  );
  atteso(
    Math.abs(m.sinistra - m.destra) <= 1,
    `${etichetta}: la pillola è centrata (scarto ${Math.abs(m.sinistra - m.destra).toFixed(2)}px)`,
  );
  atteso(
    m.larghezza < m.vw - 24,
    `${etichetta}: larga quanto il contenuto, non a tutta riga (${m.larghezza} su ${m.vw - 24})`,
  );
  atteso(m.sbordo <= 0.5, `${etichetta}: il contenuto sta dentro la pillola (${m.sbordo}px fuori)`);
  atteso(m.font >= 13, `${etichetta}: testo delle voci a ${m.font}px, mai sotto 13`);
  atteso(m.righe === 1, `${etichetta}: nessuna voce va a capo`);
  if (mobile) {
    atteso(
      m.pad * 2 <= 20.5,
      `${etichetta}: spazio tra le voci contenuto (${(m.pad * 2).toFixed(2)}px)`,
    );
  }
  atteso(m.attivo === voce, `${etichetta}: la voce attiva è "${voce}" (${m.attivo})`);
  atteso(
    m.thumbVisibile && m.scartoCentro <= 0.51 && m.scartoLarghezza <= 0.51,
    `${etichetta}: riempimento centrato sulla voce (centro ${m.scartoCentro}px, larghezza ${m.scartoLarghezza}px)`,
  );
  atteso(m.overflow <= 0, `${etichetta}: nessun overflow orizzontale`);
  const { logo } = m;
  atteso(
    logo.w === 44 && logo.h === 44 && logo.svg === 36 && logo.scarto <= 0.5,
    `${etichetta}: marchio 44x44 con SVG da 36 al centro (${logo.w}x${logo.h}, svg ${logo.svg}, scarto ${logo.scarto}px)`,
  );
  atteso(
    logo.label === "Luigi Romano, torna alla home" && logo.testo === "",
    `${etichetta}: il marchio ha il nome nell'aria-label e nessun testo visibile`,
  );
  atteso(m.sep === !mobile, `${etichetta}: separatore ${mobile ? "assente" : "presente"} (${m.sep})`);
  return m.pad;
};

/* Gli spazi devono crescere con la larghezza, non restare fermi né esplodere */
const spazi = [];

for (const vp of viewport) {
  for (const pagina of pagine) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.goto(BASE + pagina.url, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    await page.evaluate(() => document.fonts.ready);

    const attiva = async () => {
      if (!pagina.sezione) return;
      await page.evaluate((id) => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      }, pagina.sezione);
      await page.waitForTimeout(400);
    };

    await attiva();
    await page.waitForTimeout(400);
    const m = await misura(page);
    const pad = verifica(m, `${vp.w}px ${pagina.voce}`, pagina.voce);
    if (pagina.voce === "Progetti") spazi.push({ w: vp.w, pad });

    if (vp.ruota) {
      await page.setViewportSize({ width: vp.h, height: vp.w });
      await attiva();
      await page.waitForTimeout(400);
      const mr = await misura(page);
      verifica(mr, `${vp.h}×${vp.w} orizz. ${pagina.voce}`, pagina.voce);
    }

    await page.close();
  }
}

/* Focus da tastiera: primo Tab sul link "salta", secondo sul marchio */
for (const w of [320, 1280]) {
  const page = await browser.newPage({ viewport: { width: w, height: 800 } });
  await page.goto(BASE + "/come-lavoro", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const f = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return {
      logo: el.classList.contains("site-nav__logo"),
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
    };
  });
  atteso(
    f.logo && f.outline === "2px solid rgb(26, 26, 26)",
    `${w}px: il marchio prende il focus con l'anello ink (${f.outline})`,
  );
  await page.close();
}

/* Il nome per intero non è più nella nav: deve restare nel resto della pagina */
const conNome = ["/", "/come-lavoro", "/contatti", "/progetti/caso-reale", "/404"];
for (const url of conNome) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + url, { waitUntil: "domcontentloaded" });
  const n = await page.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? "";
    return {
      titolo: document.title,
      site: meta('meta[property="og:site_name"]'),
      og: meta('meta[property="og:title"]'),
      tw: meta('meta[name="twitter:title"]'),
      autore: meta('meta[name="author"]'),
      footer: document.querySelector("body > footer")?.textContent ?? "",
    };
  });
  const nome = "Luigi Romano";
  atteso(n.titolo.includes(nome), `${url}: titolo "${n.titolo}"`);
  atteso(
    [n.site, n.og, n.tw, n.autore].every((v) => v.includes(nome)),
    `${url}: og:site_name, og:title, twitter:title e author contengono il nome`,
  );
  atteso(n.footer.includes(nome), `${url}: il nome è nel footer`);
  await page.close();
}

/*
  Riempimento della voce attiva: fondo ink su ogni pagina. Se il colore del
  thumb sparisce (un token rimosso, una variabile scritta male) il testo cream
  resta su cream-2 e la voce diventa invisibile: build e CSS non lo segnalano.
  Per ogni voce col testo cream il thumb deve essere visibile, ink e sotto di
  lei; se nessuna voce è attiva, nessun testo deve essere cream.
*/
const riempimento = (page) =>
  page.evaluate(() => {
    const colore = (token) => {
      const prova = document.createElement("span");
      prova.style.color = `var(${token})`;
      document.body.append(prova);
      const c = getComputedStyle(prova).color;
      prova.remove();
      return c;
    };
    const ink = colore("--color-ink");
    const cream = colore("--color-cream");
    const thumb = document.querySelector(".site-nav__thumb");
    const ct = getComputedStyle(thumb);
    const rt = thumb.getBoundingClientRect();
    const links = [...document.querySelectorAll(".site-nav__link")];
    const chiare = links.filter((l) => getComputedStyle(l).color === cream);
    return {
      ink,
      fondo: ct.backgroundColor,
      visibile: Number(ct.opacity) > 0.99,
      attive: links.filter((l) => l.hasAttribute("aria-current")).map((l) => l.textContent.trim()),
      chiare: chiare.map((l) => {
        const r = l.getBoundingClientRect();
        return {
          voce: l.textContent.trim(),
          scarto: +Math.abs(rt.left + rt.width / 2 - (r.left + r.width / 2)).toFixed(2),
        };
      }),
    };
  });

const verificaRiempimento = (f, etichetta, voce) => {
  if (voce) {
    atteso(
      f.attive.length === 1 && f.attive[0] === voce,
      `${etichetta}: una sola voce attiva, "${voce}" (${f.attive.join(", ") || "nessuna"})`,
    );
  } else {
    atteso(f.attive.length === 0, `${etichetta}: nessuna voce attiva (${f.attive.join(", ") || "nessuna"})`);
  }
  if (f.chiare.length === 0) {
    atteso(!voce, `${etichetta}: nessun testo cream nella nav`);
    return;
  }
  for (const c of f.chiare) {
    atteso(
      f.fondo === f.ink && f.visibile && c.scarto <= 0.51,
      `${etichetta}: "${c.voce}" cream su riempimento ink (fondo ${f.fondo}, visibile ${f.visibile}, scarto ${c.scarto}px)`,
    );
  }
};

const tuttePagine = [
  { url: "/", voce: null },
  { url: "/", voce: "Progetti", sezione: "progetti" },
  { url: "/come-lavoro", voce: "Come lavoro" },
  { url: "/contatti", voce: "Contatti" },
  { url: "/progetti/caso-reale", voce: null },
  { url: "/progetti/fornace-vietri", voce: null },
  { url: "/progetti/pizzeria", voce: null },
  { url: "/404", voce: null },
  { url: "/styleguide", voce: null },
];

/* Pagina aperta direttamente */
for (const w of [390, 1280]) {
  for (const p of tuttePagine) {
    const page = await browser.newPage({ viewport: { width: w, height: 844 } });
    await page.goto(BASE + p.url, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    await page.evaluate(() => document.fonts.ready);
    if (p.sezione) {
      await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: "start" }), p.sezione);
    }
    await page.waitForTimeout(600);
    verificaRiempimento(await riempimento(page), `${w}px ${p.url}${p.sezione ? "#" + p.sezione : ""}`, p.voce);
    await page.close();
  }
}

/* Pagina raggiunta dalla nav (View Transitions, header persistito) */
const giro = [
  { da: "/", clic: "Come lavoro", voce: "Come lavoro" },
  { da: "/come-lavoro", clic: "Contatti", voce: "Contatti" },
  { da: "/contatti", clic: "Progetti", voce: "Progetti" },
  { da: "/progetti/caso-reale", clic: "Contatti", voce: "Contatti" },
  { da: "/404", clic: "Come lavoro", voce: "Come lavoro" },
];
for (const w of [390, 1280]) {
  for (const g of giro) {
    const page = await browser.newPage({ viewport: { width: w, height: 844 } });
    await page.goto(BASE + g.da, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.querySelector(".site-nav").dataset.marcato = "si";
    });
    await page.click(`.site-nav__link:text-is("${g.clic}")`);
    await page.waitForURL((u) => u.pathname !== g.da, { timeout: 5000 });
    await page.waitForTimeout(1000);
    const etichetta = `${w}px ${g.da} → ${g.clic}`;
    const persistito = await page.evaluate(
      () => document.querySelector(".site-nav").dataset.marcato === "si",
    );
    atteso(persistito, `${etichetta}: l'header è lo stesso nodo della pagina di partenza`);
    verificaRiempimento(await riempimento(page), etichetta, g.voce);
    await page.close();
  }
}

/* Dalla home con "Progetti" attiva a un'altra pagina: "Progetti" si spegne */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.evaluate(() => document.getElementById("progetti")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(600);
  await page.click('.site-nav__link:text-is("Contatti")');
  await page.waitForURL("**/contatti");
  await page.waitForTimeout(1000);
  verificaRiempimento(await riempimento(page), "1280px /#progetti → Contatti", "Contatti");
  await page.close();
}

const cresce = spazi.every((s, i) => i === 0 || s.pad >= spazi[i - 1].pad);
atteso(
  cresce && spazi[0].pad < spazi.at(-1).pad,
  `spazi fluidi: crescono con la larghezza (${spazi.map((s) => `${s.w}:${s.pad}`).join(" ")})`,
);

await browser.close();

if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche nav passate");
}
