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
  6. "Luigi Romano" resta nel titolo, nei meta e nel footer di ogni pagina.
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
