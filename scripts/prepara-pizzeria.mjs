/*
  Immagini del concept Pizzeria Vico Stretto, dal modello pizzeria delle bozze
  (D:\dev\bozze-siti-napoli\mockups\pizzeria.html, aperto in sola lettura):
  palette crema, bordeaux e basilico, Lora + Source Sans 3, barra azioni in basso,
  menu a categorie, "Aperto ora", muro delle recensioni.

  Il modello si riempie qui con i dati di Vico Stretto (nome inventato, nessun logo
  vero). Si tolgono i tre modi (tavolo, asporto, casa) e il nastro dei quartieri: la
  pagina ha un solo obiettivo, far prenotare. Foto: solo le due stock Unsplash con
  fonte in D:\dev\bozze-siti-napoli\docs\FONTI-FOTO.md (forno a legna di Louis Hansel,
  tavola con le pizze di Daniel).
  L'ora è fissata a sabato 26 settembre 2026, 20:10: "Aperto ora · chiude alle 23:30".

  Uscita in src/assets/progetti/pizzeria-vico-stretto/:
    pizzeria-copertina.jpg   2400x1600, foto del forno e due telefoni, senza testi
    pizzeria-brand.jpg       2880x2440, nome, sigillo, colori, caratteri, pezzi della pagina
    pizzeria-flusso.jpg      2880x1140, prima cinque passaggi, dopo tre tocchi
    pizzeria-flusso-mobile.jpg 780x1960, lo stesso schema in colonna
    pizzeria-landing.jpg     780 di larghezza, la pagina intera da telefono
    pizzeria-prenota.jpg     780x1688, il pannello "Quando venite?"
    pizzeria-messaggio.jpg   780x1688, la chat su WhatsApp
  Uso: node scripts/prepara-pizzeria.mjs   (poi node scripts/prepara-og.mjs og/pizzeria.png)
  Serve la rete: i caratteri arrivano da Google Fonts, come nel modello.
*/
import { chromium } from "playwright";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const MODELLO = "D:/dev/bozze-siti-napoli/mockups/pizzeria.html";
const STOCK = "D:/dev/bozze-siti-napoli/foto-originali/stock/pizza";
const FOTO = {
  forno: `${STOCK}/10_W75bFvPPrK8_photo-1564936281403-f92f66f89ee0.jpg`,
  tavola: `${STOCK}/11_JcTGyFY6lWk_photo-1651980979183-79425af50103.jpg`,
};
const SIGILLO = "src/assets/loghi/vico-stretto.png";
const DIR = "src/assets/progetti/pizzeria-vico-stretto";
const ORA = new Date("2026-09-26T20:10:00+02:00");

// I colori del modello
const C = { carta: "#F7F1E5", bordeaux: "#6E1A1A", basilico: "#2F5233", pomodoro: "#B3261E", tinta: "#ECE1CD" };
const FONT_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">';

const uri = async (file, tipo) => `data:${tipo};base64,${(await readFile(file)).toString("base64")}`;
const jpg = async (file, larghezza) =>
  `data:image/jpeg;base64,${(await sharp(file).resize({ width: larghezza }).jpeg({ quality: 88 }).toBuffer()).toString("base64")}`;

const foto = { forno: await jpg(FOTO.forno, 1600), tavola: await jpg(FOTO.tavola, 1400) };

// Il sigillo VS (src/assets/loghi) è nero su bianco: diventa bordeaux su trasparente,
// usando il nero del disegno come opacità.
async function sigilloBordeaux() {
  // linear: i grigi dell'antialiasing diventano più pieni, o il sigillo esce sbiadito
  const { data, info } = await sharp(SIGILLO).flatten({ background: "#ffffff" }).greyscale().negate().linear(1.8, 0).raw().toBuffer({ resolveWithObject: true });
  const png = await sharp({ create: { width: info.width, height: info.height, channels: 3, background: C.bordeaux } })
    .joinChannel(data, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}
const sigillo = await sigilloBordeaux();

/* ---------- Il modello riempito con i dati di Vico Stretto ---------- */
function riempi({ forno }) {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  document.title = "Pizzeria Vico Stretto";
  $(".demo")?.remove();
  $$("[data-k=name]").forEach((el) => (el.textContent = "Vico Stretto"));
  $(".badge").textContent = "VS";
  $$("[data-k=anno]").forEach((el) => (el.textContent = "1961"));
  $(".claim").innerHTML = "Dal 1961 · Centro storico";

  // un solo obiettivo: prenotare
  $(".modes")?.remove();
  $(".marquee")?.remove();
  $$(".wa-note").forEach((el) => el.remove());
  $(".top .r").innerHTML = '<a href="#menu">Menu</a><a href="#orari">Dove siamo</a><a class="btn cta" href="#">Prenota un tavolo</a>';
  $(".hero-cta").innerHTML = `
    <p class="riga">Pizzeria napoletana di quartiere, con il forno a legna. Quaranta posti, si prenota su WhatsApp.</p>
    <a class="btn" href="#">Prenota un tavolo</a>
    <a class="btn o" href="#menu">Il menu</a>
    <p class="oggi" data-ore>Sabato 19:00 – 23:30</p>`;
  const ore = [[], ...Array(6).fill([["19:00", "23:30"]])];
  $("[data-ore]").dataset.ore = JSON.stringify(ore);

  $(".manifesto p").innerHTML =
    "Lievitazione lunga, pomodoro San Marzano, fior di latte, forno a legna. Quaranta posti nel centro storico, la stessa famiglia dal 1961.<b>'A pizza è 'na cosa seria.</b>";

  $(".menu-head p").textContent = "Le pizze principali con i prezzi, leggibili senza zoom.";
  const riga = ([n, p, d]) => `<li><b>${n}</b><span class="p">${p}</span><small>${d}</small></li>`;
  $(".cols").innerHTML = `
    <div><h3 id="m-pizze">Pizze</h3><ul>${[
      ["Margherita", "6,00", "pomodoro, fiordilatte, basilico"],
      ["Marinara", "5,00", "pomodoro, aglio, origano"],
      ["Provola e pepe", "7,00", "provola affumicata, pepe nero"],
      ["Salame piccante", "7,50", "pomodoro, fiordilatte, salame"],
      ["Bufala", "8,50", "pomodoro, mozzarella di bufala, basilico"],
      ["Salsiccia e friarielli", "8,00", "provola, salsiccia, friarielli"],
    ].map(riga).join("")}</ul></div>
    <div><h3 id="m-fritti">Fritti</h3><ul>${[
      ["Frittatina", "2,50", "bucatini, besciamella, piselli"],
      ["Crocchè", "1,50", "patate e provola"],
      ["Montanara", "3,00", "impasto fritto, pomodoro, basilico"],
    ].map(riga).join("")}</ul>
    <h3 id="m-da-bere">Da bere</h3><ul>${[
      ["Birra 33 cl", "4,00", "bionda o rossa"],
      ["Acqua 1 l", "1,50", "naturale o frizzante"],
    ].map(riga).join("")}</ul></div>`;
  $(".menu .cta-row").innerHTML = '<a class="btn" href="#">Prenota un tavolo</a>';

  const ph = $(".feat .ph");
  ph.innerHTML = "";
  ph.style.background = `url(${forno}) center/cover`;
  $(".feat p").textContent = "Il forno sta davanti, non dietro. Guardi la pizza entrare e uscire. Quaranta posti, tavolate fino a 12 persone.";
  $(".feat .btn").textContent = "Prenota un tavolo";

  $(".wall .legend").textContent = "Recensioni di esempio: nel sito vero si mostrano quelle di Google.";

  $(".orari dl").innerHTML = "<dt>Lun</dt><dd>chiuso</dd><dt>Mar – Dom</dt><dd>19:00 – 23:30</dd>";
  $(".orari [data-k=indirizzo]").textContent = "Centro storico";
  $(".orari [data-k=quartiere]").textContent = "Napoli";
  $(".orari .cta-row").innerHTML = '<a class="btn" href="#">Prenota un tavolo</a>';
  $(".foot").innerHTML = "<span>© Pizzeria Vico Stretto · progetto inventato</span><span>Privacy · Cookie</span>";

  // barra in basso: Prenota, Chiama, Menu
  const bar = $(".bar");
  bar.querySelector(".pri .l").textContent = "Prenota";
  const seconda = bar.children[1];
  seconda.innerHTML =
    '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg><span class="l">Chiama</span>';
}

/* Il pannello "Quando venite?", con i colori e i caratteri del modello */
const PANNELLO = `
<style>
  .pv{position:fixed;inset:0;z-index:50;background:rgba(47,20,20,.45)}
  .pp{position:fixed;left:0;right:0;bottom:0;z-index:51;background:var(--paper);color:var(--ink);border-radius:22px 22px 0 0;
      padding:12px 20px calc(24px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.25)}
  .pp__maniglia{width:44px;height:5px;border-radius:3px;background:rgba(110,26,26,.25);margin:0 auto 14px}
  .pp h2{font-size:2rem;font-weight:500;text-transform:none;margin:0 0 4px;line-height:1.1}
  .pp__lab{margin:18px 0 8px;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--basil)}
  .pp__chips{display:flex;flex-wrap:wrap;gap:8px}
  .pp__chips span{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:1.5px solid var(--ink);border-radius:999px;
      font-family:var(--display);font-style:italic;font-weight:600;font-size:1.05rem}
  .pp__chips span.si{background:var(--ink);color:var(--paper)}
  .pp__persone{display:flex;align-items:center;gap:18px}
  .pp__persone span{display:grid;place-items:center;width:48px;height:48px;border:1.5px solid var(--ink);border-radius:50%;font-size:1.5rem}
  .pp__persone b{font-family:var(--display);font-weight:600;font-size:2rem;min-width:1.2em;text-align:center}
  .pp__riep{margin:20px 0 12px;padding:12px 14px;background:var(--tint);font-weight:600}
  .pp .btn{width:100%;gap:10px}
  .pp__nota{margin-top:10px;font-size:.92rem;color:var(--basil);text-align:center}
</style>
<div class="pv"></div>
<div class="pp" role="dialog" aria-label="Quando venite?">
  <div class="pp__maniglia"></div>
  <h2>Quando venite?</h2>
  <p class="pp__lab">Giorno</p>
  <div class="pp__chips"><span>Gio 24</span><span>Ven 25</span><span class="si">Sab 26</span><span>Dom 27</span></div>
  <p class="pp__lab">Orario</p>
  <div class="pp__chips"><span>19:30</span><span>20:00</span><span class="si">20:30</span><span>21:00</span><span>21:30</span></div>
  <p class="pp__lab">Persone</p>
  <div class="pp__persone"><span>−</span><b>4</b><span>+</span></div>
  <p class="pp__riep">Sabato 26 · ore 20:30 · 4 persone</p>
  <a class="btn" href="#"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.6a8.6 8.6 0 0 1-12.7 7.6L3.5 20.5l1.3-4.1a8.6 8.6 0 1 1 15.7-4.8z"/></svg>Invia su WhatsApp</a>
  <p class="pp__nota">La pizzeria conferma con una risposta.</p>
</div>`;

/* La chat su WhatsApp: interfaccia generica, senza marchi */
const CHAT = `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${FONT_LINK}<style>
  *{box-sizing:border-box} html,body{margin:0;height:100%}
  body{font:17px/1.4 "Source Sans 3",system-ui,sans-serif;background:#EFE7DC;color:#111;display:flex;flex-direction:column}
  .testa{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#1F5E54;color:#fff}
  .testa .b{width:42px;height:42px;border-radius:50%;background:${C.carta};color:${C.bordeaux};display:grid;place-items:center;
     font:600 17px "Lora",serif}
  .testa b{display:block;font-weight:600;font-size:17px} .testa small{opacity:.8;font-size:13px}
  .giorno{align-self:center;margin:18px 0 8px;padding:4px 12px;border-radius:8px;background:#fff;font-size:13px;color:#555}
  .msg{max-width:80%;margin:6px 14px;padding:9px 12px 20px;border-radius:12px;position:relative;box-shadow:0 1px 1px rgba(0,0,0,.12)}
  .msg time{position:absolute;right:10px;bottom:4px;font-size:12px;color:#667}
  .io{align-self:flex-end;background:#D9FDD3;border-top-right-radius:2px}
  .loro{align-self:flex-start;background:#fff;border-top-left-radius:2px}
  .spazio{flex:1}
  .scrivi{display:flex;gap:10px;padding:10px 12px 24px}
  .scrivi span{flex:1;height:46px;border-radius:23px;background:#fff}
  .scrivi i{width:46px;height:46px;border-radius:50%;background:#1F8A70}
</style></head><body>
  <div class="testa"><span class="b">VS</span><div><b>Pizzeria Vico Stretto</b><small>online</small></div></div>
  <span class="giorno">Oggi</span>
  <div class="msg io">Ciao! Vorrei prenotare un tavolo.<br>Giorno: sabato 26<br>Orario: 20:30<br>Persone: 4<time>20:12</time></div>
  <div class="msg loro">Perfetto, vi aspettiamo sabato alle 20:30. A presto!<time>20:14</time></div>
  <div class="spazio"></div>
  <div class="scrivi"><span></span><i></i></div>
</body></html>`;

/* Lo schema del flusso: prima cinque passaggi, dopo tre tocchi */
const PRIMA = ["Vedi un reel e vuoi prenotare", "Esci da Instagram e cerchi il numero", "Chiami, ma sono in pieno servizio", "Scrivi in direct e aspetti", "La risposta arriva tardi, o non arriva"];
const DOPO = ["Tocchi il link nella bio di Instagram", "Scegli giorno, orario e persone", "Invii il messaggio già scritto su WhatsApp"];
const flusso = (mobile) => `<!doctype html><html lang="it"><head><meta charset="utf-8">${FONT_LINK}<style>
  *{box-sizing:border-box} html,body{margin:0}
  body{background:${C.carta};color:${C.bordeaux};font-family:"Source Sans 3",sans-serif;
       ${mobile ? "" : "height:1140px;align-content:center;"}
       padding:${mobile ? "56px 40px" : "70px 120px"};display:grid;grid-template-columns:${mobile ? "1fr" : "1fr 1.3fr"};gap:${mobile ? "64px" : "120px"}}
  .lab{font-weight:700;font-size:${mobile ? 22 : 32}px;letter-spacing:.16em;text-transform:uppercase;color:${C.basilico}}
  h2{font-family:"Lora",serif;font-weight:500;font-size:${mobile ? 50 : 76}px;line-height:1.15;margin:20px 0 34px}
  h2 em{font-style:italic}
  .prima h2{color:rgba(110,26,26,.6)}
  ol{list-style:none;margin:0;padding:0}
  .prima li{display:flex;gap:28px;align-items:baseline;padding:${mobile ? 22 : 24}px 0;border-bottom:1.5px solid rgba(110,26,26,.2);
      font-size:${mobile ? 30 : 42}px;color:rgba(110,26,26,.6)}
  .prima li span{text-decoration:line-through;text-decoration-thickness:2px}
  .prima li b{font-family:"Lora",serif;font-weight:500;min-width:1em}
  .dopo .passi{display:grid;grid-template-columns:${mobile ? "1fr" : "repeat(3,1fr)"};gap:${mobile ? "30px" : "56px"}}
  .passo b{display:block;font-family:"Lora",serif;font-style:italic;font-weight:500;font-size:${mobile ? 120 : 220}px;line-height:1;color:${C.bordeaux}}
  .passo p{margin:0;padding-top:24px;border-top:3px solid ${C.bordeaux};font-size:${mobile ? 32 : 46}px;line-height:1.3;color:#2a1414}
  .ok{margin-top:${mobile ? 36 : 60}px;display:inline-flex;align-items:center;gap:14px;padding:16px 30px;border-radius:999px;
      background:${C.basilico};color:${C.carta};font-weight:600;font-size:${mobile ? 28 : 38}px}
</style></head><body>
  <section class="prima"><div class="lab">Prima</div><h2>Cinque passaggi, e la prenotazione spesso si perde.</h2>
    <ol>${PRIMA.map((t, i) => `<li><b>${i + 1}</b><span>${t}</span></li>`).join("")}</ol></section>
  <section class="dopo"><div class="lab">Dopo</div><h2>Tre tocchi. <em>La pizzeria conferma con una risposta.</em></h2>
    <div class="passi">${DOPO.map((t, i) => `<div class="passo"><b>${i + 1}</b><p>${t}</p></div>`).join("")}</div>
    <span class="ok">✓ Confermato dalla pizzeria</span></section>
</body></html>`;

/* ---------- Scatti ---------- */
const browser = await chromium.launch();

async function paginaModello(opzioni) {
  const ctx = await browser.newContext(opzioni);
  await ctx.clock.setFixedTime(ORA);
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(MODELLO).href, { waitUntil: "networkidle" });
  await page.evaluate(riempi, { forno: foto.forno });
  // lo script di "Aperto ora" del modello è già girato col testo vecchio: lo si rilancia
  await page.evaluate(() => {
    const s = [...document.scripts].find((x) => x.textContent.includes("data-ore"));
    if (s) new Function(s.textContent)();
  });
  await page.addStyleTag({ content: ".marquee .track{animation:none}" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  return { ctx, page };
}

const salva = async (buf, nome, q = 85) => {
  const info = await sharp(buf).jpeg({ quality: q, mozjpeg: true }).toFile(`${DIR}/${nome}`);
  console.log(`ok ${nome} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
};

const TEL = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

// La pagina intera da telefono: la barra fissa scende in fondo all'immagine
const schermi = {};
{
  const { ctx, page } = await paginaModello(TEL);
  schermi.home = await page.screenshot({ type: "jpeg", quality: 92 });
  await page.evaluate(() => document.querySelector("#menu").scrollIntoView());
  await page.waitForTimeout(300);
  schermi.menu = await page.screenshot({ type: "jpeg", quality: 92 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.addStyleTag({ content: ".bar{position:absolute !important;bottom:0} body{position:relative}" });
  // La pagina intera è alta più di 4000px CSS: in galleria diventerebbe una striscia
  // lunghissima. Si divide in due colonne affiancate all'inizio della sezione col forno.
  const intera = await page.screenshot({ fullPage: true });
  const taglio = 2 * (await page.evaluate(() => Math.round(document.querySelector(".feat").getBoundingClientRect().top + scrollY)));
  const { height: alta } = await sharp(intera).metadata();
  const sopra = await sharp(intera).extract({ left: 0, top: 0, width: 780, height: taglio }).toBuffer();
  const sotto = await sharp(intera).extract({ left: 0, top: taglio, width: 780, height: alta - taglio }).toBuffer();
  const SPAZIO = 60;
  await salva(
    await sharp({ create: { width: 780 * 2 + SPAZIO, height: Math.max(taglio, alta - taglio), channels: 3, background: C.tinta } })
      .composite([{ input: sopra, left: 0, top: 0 }, { input: sotto, left: 780 + SPAZIO, top: 0 }])
      .png()
      .toBuffer(),
    "pizzeria-landing.jpg",
    82,
  );

  await page.addStyleTag({ content: ".bar{position:fixed !important}" });
  await page.evaluate((html) => document.body.insertAdjacentHTML("beforeend", html), PANNELLO);
  await page.waitForTimeout(300);
  schermi.prenota = await page.screenshot();
  await salva(schermi.prenota, "pizzeria-prenota.jpg");
  await ctx.close();
}
{
  const page = await browser.newPage(TEL);
  await page.setContent(CHAT, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  schermi.chat = await page.screenshot();
  await salva(schermi.chat, "pizzeria-messaggio.jpg");
  await page.close();
}
{
  const { ctx, page } = await paginaModello({ viewport: { width: 1440, height: 900 } });
  schermi.desktop = await page.screenshot({ type: "jpeg", quality: 92 });
  await ctx.close();
}
for (const mobile of [false, true]) {
  const page = await browser.newPage({ viewport: mobile ? { width: 780, height: 400 } : { width: 2880, height: 1140 } });
  await page.setContent(flusso(mobile), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await salva(await page.screenshot({ fullPage: mobile }), mobile ? "pizzeria-flusso-mobile.jpg" : "pizzeria-flusso.jpg");
  await page.close();
}

/* ---------- Composizioni: copertina e marchio ---------- */
const b64 = (buf) => `data:image/jpeg;base64,${buf.toString("base64")}`;
const telefono = (src, stile) =>
  `<div class="tel" style="${stile}"><div class="tel__vetro"><img src="${src}"></div></div>`;
const COMUNE = `*{box-sizing:border-box} html,body{margin:0}
  .tel{position:absolute;width:430px;padding:12px;border-radius:62px;background:#1a0d0d;box-shadow:0 36px 80px rgba(70,20,20,.28)}
  .tel__vetro{border-radius:50px;overflow:hidden;aspect-ratio:390/844;background:#fff}
  .tel__vetro img{display:block;width:100%}`;

const COPERTINA = `<!doctype html><html><head><meta charset="utf-8"><style>${COMUNE}
  body{width:2400px;height:1600px;overflow:hidden;background:${C.carta}}
  .foto{position:absolute;left:260px;top:200px;width:980px;height:1200px;border-radius:30px;overflow:hidden}
  .foto img{width:100%;height:100%;object-fit:cover;object-position:46% 50%}
  .fascia{position:absolute;left:0;right:0;bottom:0;height:300px;background:${C.bordeaux}}
</style></head><body>
  <div class="fascia"></div>
  <div class="foto"><img src="${foto.forno}"></div>
  ${telefono(b64(schermi.home), "left:1130px;top:250px;transform:rotate(-3deg)")}
  ${telefono(b64(schermi.menu), "left:1650px;top:330px;transform:rotate(3deg)")}
</body></html>`;

const MARCHIO = `<!doctype html><html lang="it"><head><meta charset="utf-8">${FONT_LINK}<style>${COMUNE}
  body{width:2880px;margin:0;background:${C.carta};color:${C.bordeaux};font-family:"Source Sans 3",sans-serif;
       padding:140px 150px;display:grid;grid-template-columns:1080px 1290px;justify-content:space-between;align-items:start}
  .col{display:flex;flex-direction:column;align-items:flex-start;gap:56px}
  .sig{width:300px;height:300px;object-fit:contain}
  h1{font-family:"Lora",serif;font-weight:500;font-size:230px;line-height:1;letter-spacing:-.01em;margin:0}
  .claim{padding:12px 30px;border:2px solid ${C.bordeaux};border-radius:999px;font:italic 500 46px "Lora",serif;rotate:-3deg;margin-top:-16px}
  .testo{margin:0;font-size:44px;line-height:1.45;color:#2a1414;max-width:30ch}
  .colori{display:flex;gap:26px}
  .colori div{width:250px;height:250px;padding:26px;display:flex;flex-direction:column;justify-content:flex-end;font-size:30px;border:2px solid rgba(110,26,26,.15)}
  .colori b{font:500 40px "Lora",serif}
  .caratteri{align-self:stretch;padding-top:40px;border-top:2px solid rgba(110,26,26,.25);display:flex;justify-content:space-between;align-items:baseline}
  .caratteri b{font:500 110px "Lora",serif} .caratteri b em{font-style:italic}
  .caratteri span{font-size:52px;font-weight:600}
  .caratteri small{display:block;font-size:30px;font-weight:400;color:${C.basilico};margin-top:10px}
  .destra{display:flex;flex-direction:column;gap:56px}
  .foto{display:grid;grid-template-columns:760px 1fr;gap:40px}
  .foto img{width:100%;height:620px;object-fit:cover;border-radius:24px}
  .pezzo{background:#fff;border-radius:24px;padding:46px 54px;box-shadow:0 24px 60px rgba(110,26,26,.12)}
  .pezzo h3{font:italic 500 64px "Lora",serif;margin:0 0 20px}
  .pezzo li{display:grid;grid-template-columns:1fr auto;padding:20px 0;border-bottom:1.5px solid rgba(110,26,26,.2);font:600 44px "Lora",serif;text-transform:uppercase}
  .pezzo li:last-child{border:0}
  .pezzo li small{grid-column:1;font:400 32px "Source Sans 3",sans-serif;text-transform:none;color:${C.basilico}}
  .pezzo ul{list-style:none;margin:0;padding:0}
  .oggi{display:inline-flex;align-items:center;gap:16px;font-size:40px;font-weight:600;color:${C.basilico}}
  .oggi::before{content:"";width:22px;height:22px;border-radius:50%;background:currentColor}
  .barra{height:150px;display:grid;grid-template-columns:1.4fr 1fr 1fr;border-radius:24px;overflow:hidden;background:#fff;
     box-shadow:0 24px 60px rgba(110,26,26,.12);font-size:38px;font-weight:600}
  .barra span{display:grid;place-items:center;border-left:1.5px solid rgba(110,26,26,.2)}
  .barra span:first-child{background:${C.bordeaux};color:${C.carta};border:0}
</style></head><body>
  <div class="col">
    <img class="sig" src="${sigillo}" alt="">
    <h1>Vico<br>Stretto</h1>
    <span class="claim">Dal 1961 · Centro storico</span>
    <p class="testo">Una pizzeria di quartiere nel centro storico. Carta crema e un solo inchiostro bordeaux, il verde del basilico per quello che è aperto e confermato.</p>
    <div class="colori">
      <div style="background:${C.carta}"><b>Crema</b>#F7F1E5</div>
      <div style="background:${C.bordeaux};color:${C.carta}"><b>Bordeaux</b>#6E1A1A</div>
      <div style="background:${C.basilico};color:${C.carta}"><b>Basilico</b>#2F5233</div>
      <div style="background:${C.tinta}"><b>Farina</b>#ECE1CD</div>
    </div>
    <div class="caratteri"><b>Lora <em>corsivo</em></b><span>Source Sans 3<small>per i testi e i prezzi</small></span></div>
  </div>
  <div class="destra">
    <div class="foto"><img src="${foto.forno}" alt=""><img src="${foto.tavola}" style="object-position:50% 20%" alt=""></div>
    <div class="pezzo">
      <h3>Pizze</h3>
      <ul>
        <li>Margherita<span>6,00</span><small>pomodoro, fiordilatte, basilico</small></li>
        <li>Marinara<span>5,00</span><small>pomodoro, aglio, origano</small></li>
        <li>Provola e pepe<span>7,00</span><small>provola affumicata, pepe nero</small></li>
        <li>Salame piccante<span>7,50</span><small>pomodoro, fiordilatte, salame</small></li>
      </ul>
    </div>
    <div class="pezzo" style="padding:34px 54px"><span class="oggi">Aperto ora · chiude alle 23:30</span></div>
    <div class="barra"><span>Prenota</span><span>Chiama</span><span>Menu</span></div>
  </div>
</body></html>`;

for (const [nome, html, w, h] of [
  ["pizzeria-copertina.jpg", COPERTINA, 2400, 1600],
  ["pizzeria-brand.jpg", MARCHIO, 2880, 1000],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  // la copertina ha misura fissa, la tavola del marchio è alta quanto il contenuto
  await salva(await page.screenshot({ fullPage: nome !== "pizzeria-copertina.jpg" }), nome, 86);
  await page.close();
}

await browser.close();
