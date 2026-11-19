/*
  Immagini del caso Sisters Store, dai file sorgente. Due stili, tutti e due coi colori del
  brand kit di Sisters Store (~/studio/ponte/clienti/sisters-store/brand-kit.md):
  - B "Notte": la foto dell'hero di sistersstore.it (Autunno 2026) sfocata e scurita come fondo,
    computer e telefono davanti. Copertina (e quindi og), slider della home da computer,
    galleria della home da telefono.
  - A "Cipria": fondo cipria, telefono e foto prodotto su carte cipria chiaro. Slider della
    scheda prodotto, galleria di collezioni e filtri.
  Lo slider e le gallerie confrontano prima e dopo: le due immagini di ogni coppia hanno la
  stessa cornice, cambia solo lo schermo.

  Sorgenti:
  - src/assets/progetti/sisters-store/catture/  le schermate di scripts/cattura-sisters.mjs
  - src/assets/progetti/sisters-store/foto/     le foto di sistersstore.it (home, 19 novembre
    2026): hero-autunno-2026.jpg è la foto dell'hero, i .webp sono le foto prodotto della
    sezione "Da non perdere ora", ritagliate e ridotte a 900px
  - D:/dev/sisters-data/logo/Nuovo/out/        loghi (SVG)

  Uscita:
  - i due loghi per /loghi/sisters-store, PNG trasparenti:
      src/assets/loghi/sisters-store.png        monogramma SS e nome, senza tagline
      src/assets/loghi/sisters-store-prima.png  la scritta corsiva con i due profili, il logo di prima
  - in src/assets/progetti/sisters-store/:
      sisters-copertina.jpg                 2400x1600, B: logo in negativo, computer e telefono.
                                            Tutto tra x 280 e 2220 (la card grande taglia i lati)
                                            e tra y 170 e 1430 (l'og 1200x630 taglia sopra e sotto)
      sisters-<prima|dopo>-home-desktop.jpg B, il computer (slider della home)
      sisters-<prima|dopo>-home.jpg         B, la pagina lunga in un telefono (galleria)
      sisters-<prima|dopo>-scheda.jpg       A, il telefono e sotto due carte prodotto (slider)
      sisters-<prima|dopo>-collezione.jpg   A, la pagina lunga in un telefono (galleria)
      sisters-<prima|dopo>-filtri.jpg       A, il telefono (galleria)
  Gli SVG e le composizioni li disegna Chromium (Playwright), come in prepara-og.mjs: i tracciati
  del logo usano maschere e gradienti che librsvg rende male.
  Uso: node scripts/prepara-sisters.mjs   (poi node scripts/prepara-og.mjs og/sisters-store.jpg)
*/
import { chromium } from "playwright";
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const LOGHI = [
  {
    da: "D:/dev/sisters-data/logo/Nuovo/out/sisters-logo-verticale-senza-tagline.svg",
    a: "src/assets/loghi/sisters-store.png",
  },
  { da: "D:/dev/sisters-data/logosss.svg", a: "src/assets/loghi/sisters-store-prima.png" },
];
const ALTEZZA_LOGO = 600;

const DIR = "src/assets/progetti/sisters-store";
const CATTURE = `${DIR}/catture`;
const FOTO = `${DIR}/foto`;

// i colori del brand kit di Sisters Store, non quelli del portfolio
const K = { nero: "#121212", cipria: "#F2E0D6", cipriaChiaro: "#FBF4F1", rosa: "#E7C6B3", viola: "#C251D9" };

const b64 = async (f) => (await readFile(f)).toString("base64");
const uri = async (f, tipo) => `data:${tipo};base64,${await b64(f)}`;
const jpeg = (f) => uri(f, "image/jpeg");

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

/* --- Loghi: SVG a 600px di altezza, fondo trasparente, poi ritaglio del vuoto --- */
for (const { da, a } of LOGHI) {
  const svg = await b64(da);
  await page.setViewportSize({ width: 2400, height: ALTEZZA_LOGO });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">
      <img id="l" src="data:image/svg+xml;base64,${svg}" style="height:${ALTEZZA_LOGO}px;display:block">
    </body></html>`,
  );
  await page.waitForTimeout(300);
  const png = await page.locator("#l").screenshot({ omitBackground: true });
  const info = await sharp(png).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(a);
  console.log(`ok ${a} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
}

/* --- Materiali delle composizioni --- */
const notte = await jpeg(`${FOTO}/hero-autunno-2026.jpg`);
const logoNegativo = await uri("D:/dev/sisters-data/logo/Nuovo/out/sisters-logo-orizzontale-scuro.svg", "image/svg+xml");
const borsa = await uri(`${FOTO}/borsa-saint-barth.webp`, "image/webp");
const zaino = await uri(`${FOTO}/zaino-sprayground.webp`, "image/webp");
// la prima schermata della home da telefono (786x1704), per la copertina
const primaSchermata = `data:image/jpeg;base64,${(
  await sharp(`${CATTURE}/sisters-dopo-home.jpg`).extract({ left: 0, top: 0, width: 786, height: 1704 }).jpeg({ quality: 92 }).toBuffer()
).toString("base64")}`;

const STILE = `
  * { box-sizing: border-box; }
  html, body { margin: 0; overflow: hidden; }
  body { position: relative; }
  /* B: la foto dell'hero sfocata e scurita, a tutto campo */
  .notte { position: absolute; inset: 0; overflow: hidden; background: ${K.nero}; }
  .notte img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%;
       filter: blur(var(--sfocatura, 8px)) brightness(.55); transform: scale(1.06); }
  .notte::after { content: ""; position: absolute; inset: 0;
       background: linear-gradient(180deg, rgba(18,18,18,.35), rgba(18,18,18,.75)); }
  /* il telefono: cornice nera, schermo a 1:1 con la cattura */
  .tel { position: absolute; padding: 14px; border-radius: 64px; background: #0d0d0d;
       box-shadow: 0 0 0 2px #2b2b2b inset, var(--ombra); }
  .tel__vetro { border-radius: 50px; overflow: hidden; background: #fff; }
  .tel__vetro img { display: block; width: 100%; }
  /* il computer */
  .pc { position: absolute; }
  .pc__schermo { border-radius: 26px; padding: 20px; background: #0d0d0d;
       box-shadow: 0 0 0 2px #2b2b2b inset, 0 50px 120px rgba(0,0,0,.6); }
  .pc__schermo img { display: block; width: 100%; border-radius: 8px; }
  .pc__base { height: 34px; margin: 0 -90px; border-radius: 0 0 30px 30px;
       background: linear-gradient(180deg, #3a3a3a, #1c1c1c); }
  .pc__base::before { content: ""; display: block; width: 220px; height: 12px; margin: 0 auto;
       border-radius: 0 0 12px 12px; background: ${K.nero}; }
  /* A: carte cipria chiaro con le foto prodotto */
  .carta { position: absolute; border-radius: 32px; background: ${K.cipriaChiaro}; display: grid; place-items: center; }
  .carta img { width: 74%; height: 74%; object-fit: contain; }
`;

const OMBRA_NOTTE = "0 50px 120px rgba(0,0,0,.7)";
const OMBRA_CIPRIA = "0 40px 80px rgba(18,18,18,.22)";

/** Disegna una composizione e la salva in JPEG. */
async function componi(nome, w, h, corpo, sfondo) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${STILE}
    html, body { width: ${w}px; height: ${h}px; background: ${sfondo}; }
  </style></head><body>${corpo}</body></html>`);
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
  await page.waitForTimeout(200);
  const png = await page.screenshot({ type: "png" });
  const info = await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(`${DIR}/${nome}`);
  console.log(`ok ${nome} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
}

const telefono = (src, stile) =>
  `<div class="tel" style="${stile}"><div class="tel__vetro"><img src="${src}"></div></div>`;

/* --- Copertina, B --- */
await componi(
  "sisters-copertina.jpg",
  2400,
  1600,
  `<div class="notte"><img src="${notte}"></div>
   <img src="${logoNegativo}" style="position:absolute;left:330px;top:230px;height:64px">
   <div style="position:absolute;left:330px;top:322px;width:120px;height:4px;border-radius:2px;background:${K.viola}"></div>
   <div class="pc" style="left:340px;top:410px;width:1340px">
     <div class="pc__schermo"><img src="${await jpeg(`${CATTURE}/sisters-dopo-home-desktop.jpg`)}"></div>
     <div class="pc__base"></div>
   </div>
   ${telefono(primaSchermata, `left:1700px;top:380px;width:440px;--ombra:${OMBRA_NOTTE}`)}`,
  K.nero,
);

/* --- Coppie prima e dopo --- */
for (const quando of ["prima", "dopo"]) {
  // la home da computer, B: il computer al centro. Lo schermo va da x 200 a 1640 su 1840.
  await componi(
    `sisters-${quando}-home-desktop.jpg`,
    1840,
    1240,
    `<div class="notte"><img src="${notte}"></div>
     <div class="pc" style="left:180px;top:120px;width:1480px">
       <div class="pc__schermo"><img src="${await jpeg(`${CATTURE}/sisters-${quando}-home-desktop.jpg`)}"></div>
       <div class="pc__base"></div>
     </div>`,
    K.nero,
  );

  // la home da telefono, B: la pagina lunga intera in un telefono, schermo a 1:1
  {
    const { height } = await sharp(`${CATTURE}/sisters-${quando}-home.jpg`).metadata();
    await componi(
      `sisters-${quando}-home.jpg`,
      1034,
      height + 28 + 220,
      `<div class="notte" style="--sfocatura:14px"><img src="${notte}"></div>
       ${telefono(await jpeg(`${CATTURE}/sisters-${quando}-home.jpg`), `left:110px;top:110px;width:814px;--ombra:${OMBRA_NOTTE}`)}`,
      K.nero,
    );
  }

  // la scheda prodotto, A: il telefono e sotto due carte prodotto affiancate. Larga come le
  // gallerie: nello slider da 320px lo schermo resta leggibile.
  await componi(
    `sisters-${quando}-scheda.jpg`,
    1034,
    2402,
    `${telefono(await jpeg(`${CATTURE}/sisters-${quando}-scheda.jpg`), `left:110px;top:110px;width:814px;--ombra:${OMBRA_CIPRIA}`)}
     <div class="carta" style="left:110px;top:1902px;width:392px;height:390px"><img src="${borsa}"></div>
     <div class="carta" style="left:532px;top:1902px;width:392px;height:390px"><img src="${zaino}"></div>`,
    K.cipria,
  );

  // collezione e filtri, A: il telefono su fondo cipria, schermo a 1:1
  for (const cosa of ["collezione", "filtri"]) {
    const { height } = await sharp(`${CATTURE}/sisters-${quando}-${cosa}.jpg`).metadata();
    await componi(
      `sisters-${quando}-${cosa}.jpg`,
      1034,
      height + 28 + 220,
      telefono(await jpeg(`${CATTURE}/sisters-${quando}-${cosa}.jpg`), `left:110px;top:110px;width:814px;--ombra:${OMBRA_CIPRIA}`),
      K.cipria,
    );
  }
}

await browser.close();
