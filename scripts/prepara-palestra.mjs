/*
  Immagini del concept Palestra Kilo Club, dal modello palestra delle bozze
  (D:\dev\bozze-siti-napoli\mockups\palestra.html, aperto in sola lettura):
  rosso e nero, Archivo in due larghezze, scelta del piano in tre domande, bilanciere
  che si carica scorrendo, corsi per giorno, barra azioni in basso.

  Nome inventato, nessun logo vero. Foto: solo le cinque stock Unsplash con fonte in
  D:\dev\bozze-siti-napoli\docs\FONTI-FOTO.md (sezione Los Angeles Fitness: sala pesi
  di Ambitious Studio, manubri di Brett Jordan e di Jason Grant, corso in controluce
  di Marvin Meyer, sala di Samuel Girven).
  L'ora è fissata a martedì 29 settembre 2026, 18:20: "Aperto ora · chiude alle 22:00".

  Uscita in src/assets/progetti/palestra-kilo-club/:
    palestra-copertina.jpg       2400x1600, la sala e due telefoni, senza testi
    palestra-brand.jpg           2880 di larghezza, nome, colori, carattere, pezzi della pagina
    palestra-percorso.jpg        2880x1140, sito, WhatsApp, prova dal vivo
    palestra-percorso-mobile.jpg 780 di larghezza, lo stesso in colonna
    palestra-pesi.jpg            il bilanciere a 20, 80 e 140 kg mentre si scorre
    palestra-landing.jpg         la pagina intera da telefono, in colonne affiancate
    palestra-scelta.jpg          le tre domande e il consiglio, da telefono
    palestra-corsi.jpg           i corsi per giorno, da telefono
    palestra-messaggio.jpg       780x1688, la chat su WhatsApp
  Uso: node scripts/prepara-palestra.mjs   (poi node scripts/prepara-og.mjs og/palestra.jpg)
  Serve la rete: il carattere arriva da Google Fonts, come nel modello.
*/
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const MODELLO = "D:/dev/bozze-siti-napoli/mockups/palestra.html";
const STOCK = "D:/dev/bozze-siti-napoli/foto-originali/stock/gym";
const FOTO = {
  hero: `${STOCK}/10_1RNQ11ZODJM_photo-1689877020200-403d8542d95d.jpg`,
  manubri: `${STOCK}/11_NAENofLAWjE_photo-1590239926044-4131f5d0654d.jpg`,
  corso: `${STOCK}/12_VB5i6ZmXUoI_photo-1563953715689-335fe4271a1e.jpg`,
  sala: `${STOCK}/13_fqMu99l8sqo_photo-1623874514711-0f321325f318.jpg`,
  pesi: `${STOCK}/14_m4Jqyv5VwqY_photo-1734630341082-0fec0e10126c.jpg`,
};
const DIR = "src/assets/progetti/palestra-kilo-club";
const ORA = new Date("2026-09-29T18:20:00+02:00");
const C = { nero: "#0B0B0B", rosso: "#E3261C", bianco: "#F5F3EE", grigio: "#8C8A85", linea: "#2A2A2A", verde: "#5BD07A" };
const FONT_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,400..900;1,62..125,400..900&display=swap" rel="stylesheet">';

await mkdir(DIR, { recursive: true });

const jpg = async (file, larghezza) =>
  `data:image/jpeg;base64,${(await sharp(file).resize({ width: larghezza }).jpeg({ quality: 86 }).toBuffer()).toString("base64")}`;
const foto = {};
for (const [k, f] of Object.entries(FOTO)) foto[k] = await jpg(f, k === "hero" ? 2000 : 1200);

/* ---------- Il modello riempito con i dati di Kilo Club ---------- */
function riempi(foto) {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  document.title = "Kilo Club";
  $(".demo")?.remove();
  $("nav .brand").innerHTML = '<span class="badge">K</span><span class="nm">Kilo <b>Club</b></span>';
  $$(".wa-note").forEach((el) => el.remove());
  $(".hero .vid")?.remove();

  const hero = $(".hero");
  hero.style.background = `linear-gradient(180deg,rgba(11,11,11,.25),rgba(11,11,11,.9) 85%), url(${foto.hero}) 50% 40%/cover`;
  $(".hero .sub p").textContent =
    "Palestra di quartiere a Napoli. Sala pesi e corsi, aperta dalle 7 alle 22, abbonamento mensile senza vincolo. Ti conosciamo per nome dal secondo giorno.";
  $("[data-ore]").dataset.ore = JSON.stringify([
    ...Array(5).fill([["07:00", "22:00"]]),
    [["09:00", "19:00"]],
    [["09:00", "13:00"]],
  ]);

  $(".ticker .t").innerHTML = Array(2)
    .fill("<span>Sala pesi</span><span>Functional</span><span>Boxe</span><span>Pilates</span><span>Aperti 7 su 7</span><span>Nessun vincolo</span>")
    .join("");

  // la scelta porta a WhatsApp con le risposte già scritte
  $(".quiz .lead").textContent = "Niente listino da decifrare. Rispondi e ti diciamo cosa ti conviene, anche se è l'opzione più economica.";
  const btn = $(".result .btn");
  btn.textContent = "Prenota la prova su WhatsApp";
  btn.insertAdjacentHTML("afterend", '<p style="margin-top:.7rem;font-size:.85rem;opacity:.9">Il messaggio parte con la tua scelta già scritta.</p>');

  const strip = $$(".strip div");
  [["manubri", "sala pesi"], ["corso", "corsi di gruppo"], ["sala", "la sala"], ["pesi", "pesi liberi"]].forEach(([k, t], i) => {
    strip[i].style.background = `url(${foto[k]}) center/cover`;
    strip[i].querySelector("span").textContent = t;
  });

  // risultati: esempi senza nomi
  $(".fame h2").textContent = "I risultati dei soci";
  $$(".fame .card footer").forEach((f) => (f.textContent = "Risultato di esempio"));
  $$(".fame .card p")[1].textContent = "Prima panca piana a tre cifre dopo un anno di scheda seguita con il trainer.";

  $(".info [data-k=indirizzo]").textContent = "Napoli";
  $(".info [data-k=indirizzo]").parentElement.innerHTML = "Napoli<br>a due passi dalla metro";
  $(".foot").innerHTML = "<span>© Kilo Club · progetto inventato</span><span>Privacy · Cookie</span>";

  // barra in basso: prova gratis, corsi e orari sempre a portata di mano
  const bar = $(".bar");
  bar.querySelector(".pri .l").textContent = "Prova gratis";
  bar.children[1].setAttribute("href", "#corsi");
  bar.children[1].innerHTML =
    '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><span class="l">Corsi</span>';
  bar.children[2].setAttribute("href", "#info");
  bar.children[2].innerHTML =
    '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span class="l">Orari</span>';
}

/* La chat su WhatsApp: interfaccia generica, senza marchi */
const CHAT = `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${FONT_LINK}<style>
  *{box-sizing:border-box} html,body{margin:0;height:100%}
  body{font:17px/1.4 system-ui,"Segoe UI",sans-serif;background:#EFE7DC;color:#111;display:flex;flex-direction:column}
  .testa{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#1F5E54;color:#fff}
  .testa .b{width:42px;height:42px;border-radius:12px;background:${C.rosso};color:#fff;display:grid;place-items:center;
     font:900 22px "Archivo",sans-serif;font-stretch:62%}
  .testa b{display:block;font-weight:600;font-size:17px} .testa small{opacity:.8;font-size:13px}
  .giorno{align-self:center;margin:18px 0 8px;padding:4px 12px;border-radius:8px;background:#fff;font-size:13px;color:#555}
  .msg{max-width:84%;margin:6px 14px;padding:9px 12px 20px;border-radius:12px;position:relative;box-shadow:0 1px 1px rgba(0,0,0,.12)}
  .msg time{position:absolute;right:10px;bottom:4px;font-size:12px;color:#667}
  .io{align-self:flex-end;background:#D9FDD3;border-top-right-radius:2px}
  .loro{align-self:flex-start;background:#fff;border-top-left-radius:2px}
  .spazio{flex:1}
  .scrivi{display:flex;gap:10px;padding:10px 12px 24px}
  .scrivi span{flex:1;height:46px;border-radius:23px;background:#fff}
  .scrivi i{width:46px;height:46px;border-radius:50%;background:#1F8A70}
</style></head><body>
  <div class="testa"><span class="b">K</span><div><b>Kilo Club</b><small>online</small></div></div>
  <span class="giorno">Oggi</span>
  <div class="msg io">Ciao! Ho fatto la scelta sul sito.<br>Obiettivo: dimagrire<br>Giorni: 3 a settimana<br>Quando: mattina presto<br>Piano consigliato: Trimestrale + functional<br>Quando posso venire a provare?<time>18:24</time></div>
  <div class="msg loro">Ciao! Ti aspettiamo domani alle 7:30 per la prova del functional. Porta scarpe da ginnastica e un asciugamano, al resto pensiamo noi.<time>18:31</time></div>
  <div class="spazio"></div>
  <div class="scrivi"><span></span><i></i></div>
</body></html>`;

/* Il percorso: sito, WhatsApp, prova dal vivo */
const PASSI = [
  ["Sul sito", "Scegli il piano e l'obiettivo", "Tre domande: cosa vuoi ottenere, quanti giorni hai, a che ora."],
  ["Su WhatsApp", "Scrivi con la scelta già scritta", "Il sito ti fa conoscere la palestra e prepara il messaggio."],
  ["In palestra", "Vieni alla prova dal vivo", "Conosci i trainer e la sala. Qui diventi cliente."],
];
const percorso = (mobile) => `<!doctype html><html lang="it"><head><meta charset="utf-8">${FONT_LINK}<style>
  *{box-sizing:border-box} html,body{margin:0}
  body{background:${C.nero};color:${C.bianco};font-family:"Archivo",sans-serif;padding:${mobile ? "56px 40px" : "90px 120px"};
       ${mobile ? "" : "height:1140px;display:flex;flex-direction:column;justify-content:center;"}}
  .lab{font-size:${mobile ? 22 : 30}px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:${C.rosso}}
  h2{margin:18px 0 ${mobile ? 44 : 70}px;font-weight:900;font-stretch:62%;text-transform:uppercase;line-height:.92;font-size:${mobile ? 76 : 120}px}
  .passi{display:grid;grid-template-columns:${mobile ? "1fr" : "1fr auto 1fr auto 1fr"};gap:${mobile ? "26px" : "40px"};align-items:stretch}
  .passo{border:2px solid ${C.linea};padding:${mobile ? "30px" : "44px"}}
  .passo:last-child{background:${C.rosso};border-color:${C.rosso}}
  .passo small{display:block;font-size:${mobile ? 22 : 28}px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:${C.grigio}}
  .passo:last-child small{color:#fff;opacity:.85}
  .passo b{display:block;margin:14px 0;font-weight:900;font-stretch:62%;font-size:${mobile ? 120 : 150}px;line-height:.9;color:${C.rosso}}
  .passo:last-child b{color:#fff}
  .passo h3{margin:0 0 14px;font-weight:900;font-stretch:62%;text-transform:uppercase;font-size:${mobile ? 50 : 64}px;line-height:.95}
  .passo p{margin:0;font-size:${mobile ? 28 : 34}px;line-height:1.35;color:#cfccc4}
  .passo:last-child p{color:#fff}
  .freccia{align-self:center;font-size:${mobile ? 60 : 90}px;color:${C.rosso};font-weight:900;${mobile ? "justify-self:center;rotate:90deg;line-height:1" : ""}}
</style></head><body>
  <div class="lab">Il percorso</div>
  <h2>Dal sito alla sala, in tre passi.</h2>
  <div class="passi">${PASSI.map(
    ([dove, t, p], i) =>
      `${i ? '<span class="freccia">→</span>' : ""}<div class="passo"><small>${dove}</small><b>0${i + 1}</b><h3>${t}</h3><p>${p}</p></div>`,
  ).join("")}</div>
</body></html>`;

/* ---------- Scatti ---------- */
const browser = await chromium.launch();

async function paginaModello(opzioni) {
  const ctx = await browser.newContext(opzioni);
  await ctx.clock.setFixedTime(ORA);
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(MODELLO).href, { waitUntil: "networkidle" });
  await page.evaluate(riempi, foto);
  // lo script di "Aperto ora" del modello è girato senza orari: lo si rilancia
  await page.evaluate(() => {
    const s = [...document.scripts].find((x) => x.textContent.includes("data-ore"));
    if (s) new Function(s.textContent)();
  });
  await page.addStyleTag({ content: ".ticker .t{animation:none !important}" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  return { ctx, page };
}

const salva = async (buf, nome, q = 85) => {
  const info = await sharp(buf).jpeg({ quality: q, mozjpeg: true }).toFile(`${DIR}/${nome}`);
  console.log(`ok ${nome} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
};

/** Un'immagine molto alta divisa in colonne affiancate, tagliando all'inizio delle sezioni. */
async function colonne(buf, tagli, fondo) {
  const { width, height } = await sharp(buf).metadata();
  const bordi = [0, ...tagli, height];
  const pezzi = [];
  for (let i = 0; i < bordi.length - 1; i++) {
    pezzi.push(await sharp(buf).extract({ left: 0, top: bordi[i], width, height: bordi[i + 1] - bordi[i] }).toBuffer());
  }
  const SPAZIO = 60;
  const alta = Math.max(...bordi.slice(1).map((b, i) => b - bordi[i]));
  return sharp({ create: { width: width * pezzi.length + SPAZIO * (pezzi.length - 1), height: alta, channels: 3, background: fondo } })
    .composite(pezzi.map((input, i) => ({ input, left: i * (width + SPAZIO), top: 0 })))
    .png()
    .toBuffer();
}

const TEL = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const schermi = {};

// Telefono, senza movimento: i pesi restano carichi e le foto ferme
{
  const { ctx, page } = await paginaModello({ ...TEL, reducedMotion: "reduce" });
  schermi.home = await page.screenshot({ type: "jpeg", quality: 92 });

  // la scelta: le tre domande e il consiglio
  const q = await page.evaluate(() => {
    const a = document.querySelector(".quiz .q").getBoundingClientRect();
    const b = document.querySelector(".result").getBoundingClientRect();
    return { top: Math.round(a.top + scrollY - 24), bottom: Math.round(b.bottom + scrollY + 24) };
  });
  await page.evaluate((y) => window.scrollTo(0, y), q.top);
  await page.waitForTimeout(300);
  schermi.scelta = await page.screenshot({ type: "jpeg", quality: 92 });
  await salva(await page.screenshot({ fullPage: true, clip: { x: 0, y: q.top, width: 390, height: q.bottom - q.top } }), "palestra-scelta.jpg");

  // i corsi per giorno, con i giorni fissi in alto
  await page.evaluate(() => {
    const d = document.querySelector("#c-lun");
    window.scrollTo(0, d.getBoundingClientRect().top + scrollY - 250);
  });
  await page.waitForTimeout(300);
  await salva(await page.screenshot(), "palestra-corsi.jpg");

  // la pagina intera, in colonne
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.addStyleTag({ content: ".bar{position:absolute !important;bottom:0} body{position:relative} nav{position:relative !important}" });
  await page.waitForTimeout(300);
  const intera = await page.screenshot({ fullPage: true });
  // tre colonne il più possibile alte uguali: i tagli si cercano tra gli inizi delle sezioni
  const { punti, totale } = await page.evaluate(() => ({
    punti: [...document.querySelectorAll("body > *:not(nav):not(.bar):not(script)")]
      .map((el) => Math.round(el.getBoundingClientRect().top + scrollY))
      .filter((y) => y > 0),
    totale: document.documentElement.scrollHeight,
  }));
  let tagli = [];
  let peggiore = Infinity;
  for (const a of punti)
    for (const b of punti) {
      if (b <= a) continue;
      const alta = Math.max(a, b - a, totale - b);
      if (alta < peggiore) [peggiore, tagli] = [alta, [a, b]];
    }
  await salva(await colonne(intera, tagli.map((y) => 2 * y), "#1a1a1a"), "palestra-landing.jpg", 82);
  await ctx.close();
}

// La chat
{
  const page = await browser.newPage(TEL);
  await page.setContent(CHAT, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await salva(await page.screenshot(), "palestra-messaggio.jpg");
  await page.close();
}

// Desktop: i pesi che si caricano scorrendo. L'animazione è legata allo scorrimento e
// lo scatto di un elemento lo riporta in vista (cambiando lo stato): per le tre foto
// l'animazione si spegne e lo stato si scrive a mano, uguale a quello che si vede scorrendo.
{
  const { ctx, page } = await paginaModello({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  schermi.desktop = await page.screenshot({ type: "jpeg", quality: 92 });
  await page.addStyleTag({ content: ".load .kgn, .pl { animation: none !important; }" });
  const fotogrammi = [];
  for (const [kg, carichi] of [[20, 0], [80, 2], [140, 4]]) {
    await page.evaluate(
      ({ kg, carichi }) => {
        document.querySelector(".load .kgn").style.setProperty("--kg", kg);
        for (const pl of document.querySelectorAll(".pl")) {
          const n = Number([...pl.classList].find((c) => /^p\d$/.test(c)).slice(1));
          const dentro = n <= carichi;
          pl.style.opacity = dentro ? "1" : "0";
          pl.style.transform = dentro ? "none" : `translateX(${pl.classList.contains("l") ? -340 : 340}px)`;
        }
      },
      { kg, carichi },
    );
    await page.waitForTimeout(100);
    fotogrammi.push(await page.locator(".load").screenshot());
  }
  const { width, height } = await sharp(fotogrammi[0]).metadata();
  await salva(
    await sharp({ create: { width, height: height * fotogrammi.length, channels: 3, background: C.nero } })
      .composite(fotogrammi.map((input, i) => ({ input, left: 0, top: i * height })))
      .png()
      .toBuffer(),
    "palestra-pesi.jpg",
  );
  await ctx.close();
}

for (const mobile of [false, true]) {
  const page = await browser.newPage({ viewport: mobile ? { width: 780, height: 400 } : { width: 2880, height: 1140 } });
  await page.setContent(percorso(mobile), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await salva(await page.screenshot({ fullPage: mobile }), mobile ? "palestra-percorso-mobile.jpg" : "palestra-percorso.jpg");
  await page.close();
}

/* ---------- Composizioni: copertina e marchio ---------- */
const b64 = (buf) => `data:image/jpeg;base64,${buf.toString("base64")}`;
const telefono = (src, stile) =>
  `<div class="tel" style="${stile}"><div class="tel__vetro"><img src="${src}"></div></div>`;
const COMUNE = `*{box-sizing:border-box} html,body{margin:0}
  .tel{position:absolute;width:430px;padding:12px;border-radius:62px;background:#050505;box-shadow:0 0 0 2px #2b2b2b inset,0 40px 100px rgba(0,0,0,.6)}
  .tel__vetro{border-radius:50px;overflow:hidden;aspect-ratio:390/844;background:#000}
  .tel__vetro img{display:block;width:100%}`;
const DISCO = `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" fill="#141414" stroke="#2f2f2f" stroke-width="3"/><circle cx="100" cy="100" r="82" fill="none" stroke="#2a2a2a" stroke-width="10"/><ellipse cx="100" cy="46" rx="22" ry="9" fill="#0b0b0b"/><ellipse cx="53" cy="127" rx="22" ry="9" fill="#0b0b0b" transform="rotate(60 53 127)"/><ellipse cx="147" cy="127" rx="22" ry="9" fill="#0b0b0b" transform="rotate(-60 147 127)"/><circle cx="100" cy="100" r="22" fill="#cfccc4"/><circle cx="100" cy="100" r="14" fill="#0b0b0b"/><text x="100" y="80" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="900" font-size="15" fill="#E3261C" letter-spacing="2">20 KG</text><text x="100" y="168" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="700" font-size="9" fill="#8C8A85" letter-spacing="3">45 LB</text></svg>`;

const COPERTINA = `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}<style>${COMUNE}
  body{width:2400px;height:1600px;overflow:hidden;background:${C.nero};position:relative}
  .fondo{position:absolute;inset:0;background:url(${foto.hero}) 50% 40%/cover;filter:brightness(.45)}
  .fondo::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,11,11,.2),rgba(11,11,11,.7))}
  .disco{position:absolute;left:300px;top:380px;width:760px;filter:drop-shadow(0 40px 80px rgba(0,0,0,.7));rotate:-18deg}
  .riga{position:absolute;left:0;right:0;bottom:0;height:16px;background:${C.rosso}}
</style></head><body>
  <div class="fondo"></div>
  <div class="disco">${DISCO}</div>
  ${telefono(b64(schermi.home), "left:1230px;top:200px;transform:rotate(-3deg)")}
  ${telefono(b64(schermi.scelta), "left:1760px;top:290px;transform:rotate(3deg)")}
  <div class="riga"></div>
</body></html>`;

const MARCHIO = `<!doctype html><html lang="it"><head><meta charset="utf-8">${FONT_LINK}<style>
  *{box-sizing:border-box} html,body{margin:0}
  body{width:2880px;background:${C.nero};color:${C.bianco};font-family:"Archivo",sans-serif;padding:140px 150px;
       display:grid;grid-template-columns:1150px 1290px;justify-content:space-between;align-items:start}
  .col{display:flex;flex-direction:column;align-items:flex-start;gap:56px}
  .badge{width:150px;height:150px;border-radius:36px;background:${C.rosso};display:grid;place-items:center;font-weight:900;font-stretch:62%;font-size:100px}
  h1{margin:0;font-weight:900;font-stretch:62%;text-transform:uppercase;font-size:300px;line-height:.85;letter-spacing:-.01em}
  h1 b{color:${C.rosso}}
  .claim{margin:0;font-weight:900;font-stretch:62%;text-transform:uppercase;font-size:84px;line-height:.95}
  .claim em{font-style:normal;color:${C.rosso}}
  .testo{margin:0;font-size:42px;line-height:1.45;color:#cfccc4;max-width:32ch}
  .colori{display:flex;gap:26px}
  .colori div{width:250px;height:250px;padding:26px;display:flex;flex-direction:column;justify-content:flex-end;font-size:28px;border:2px solid ${C.linea}}
  .colori b{font-weight:900;font-stretch:62%;font-size:46px;text-transform:uppercase}
  .caratteri{align-self:stretch;padding-top:40px;border-top:2px solid ${C.linea};display:flex;justify-content:space-between;align-items:baseline}
  .caratteri b{font-weight:900;font-stretch:62%;font-size:120px;text-transform:uppercase}
  .caratteri span{font-size:52px;font-weight:700}
  .caratteri small{display:block;font-size:30px;font-weight:400;color:${C.grigio};margin-top:10px}
  .destra{display:flex;flex-direction:column;gap:48px}
  .foto{display:grid;grid-template-columns:1fr 1fr;gap:28px}
  .foto img{width:100%;height:560px;object-fit:cover}
  .riga{display:grid;grid-template-columns:1fr auto;align-items:center;gap:30px;padding:40px 0;border-top:2px solid ${C.linea};border-bottom:2px solid ${C.linea}}
  .riga .n{font-weight:900;font-stretch:62%;text-transform:uppercase;font-size:84px;line-height:1}
  .riga .n small{display:block;font-weight:700;font-stretch:100%;font-size:26px;letter-spacing:.18em;color:${C.rosso};margin-top:10px}
  .riga .p{font-weight:900;font-stretch:62%;font-size:120px;line-height:1;text-align:right}
  .riga .p small{display:block;font-size:28px;font-weight:700;font-stretch:100%;letter-spacing:.12em;color:${C.grigio}}
  .oggi{display:inline-flex;align-items:center;gap:16px;font-size:40px;font-weight:700;color:${C.verde}}
  .oggi::before{content:"";width:22px;height:22px;border-radius:50%;background:currentColor}
  .sotto{display:grid;grid-template-columns:330px 1fr;gap:48px;align-items:center}
  .disco{width:330px;rotate:-18deg}
  .barra{height:150px;display:grid;grid-template-columns:1.4fr 1fr 1fr;border:2px solid ${C.linea};font-size:38px;font-weight:700}
  .barra span{display:grid;place-items:center;border-left:2px solid ${C.linea}}
  .barra span:first-child{background:${C.rosso};border:0}
</style></head><body>
  <div class="col">
    <div class="badge">K</div>
    <h1>Kilo<br><b>Club</b></h1>
    <p class="claim">Prima la gente,<br><em>poi i pesi.</em></p>
    <p class="testo">Una palestra di quartiere. Nero della sala, rosso dei dischi, un solo carattere in due larghezze: stretto e pesante per i titoli.</p>
    <div class="colori">
      <div style="background:${C.nero}"><b>Nero</b>#0B0B0B</div>
      <div style="background:${C.rosso}"><b>Rosso</b>#E3261C</div>
      <div style="background:${C.bianco};color:${C.nero}"><b>Bianco</b>#F5F3EE</div>
      <div style="background:${C.grigio};color:${C.nero}"><b>Grigio</b>#8C8A85</div>
    </div>
    <div class="caratteri"><b>Archivo stretto</b><span>Archivo<small>per i testi e gli orari</small></span></div>
  </div>
  <div class="destra">
    <div class="foto"><img src="${foto.manubri}" alt=""><img src="${foto.corso}" alt=""></div>
    <div class="riga"><div class="n">Trimestrale<small>Il più scelto</small></div><div class="p">99 €<small>3 mesi</small></div></div>
    <span class="oggi">Aperto ora · chiude alle 22:00</span>
    <div class="sotto"><div class="disco">${DISCO}</div><div class="barra"><span>Prova gratis</span><span>Corsi</span><span>Orari</span></div></div>
    <img src="${foto.sala}" alt="" style="width:100%;height:330px;object-fit:cover">
  </div>
</body></html>`;

for (const [nome, html, w, h] of [
  ["palestra-copertina.jpg", COPERTINA, 2400, 1600],
  ["palestra-brand.jpg", MARCHIO, 2880, 1000],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await salva(await page.screenshot({ fullPage: nome !== "palestra-copertina.jpg" }), nome, 86);
  await page.close();
}

await browser.close();
