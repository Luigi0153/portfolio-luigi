/*
  Immagini del caso Sisters Store, dai file sorgente:
  - i due loghi per /loghi/sisters-store, in PNG trasparente:
      src/assets/loghi/sisters-store.png        monogramma SS e nome, senza tagline (in uso dal 22 ottobre 2026)
      src/assets/loghi/sisters-store-prima.png  la scritta corsiva con i due profili, il logo di prima
  - la copertina del progetto, 2400x1600, con le due home da telefono (prima e dopo)
    prese dalle catture di scripts/cattura-sisters.mjs:
      src/assets/progetti/sisters-store/sisters-copertina.jpg
  Gli SVG li disegna Chromium (Playwright), come in prepara-og.mjs: i tracciati del
  logo usano maschere e gradienti che librsvg rende male.
  Uso: node scripts/prepara-sisters.mjs   (poi node scripts/prepara-og.mjs og/sisters-store.png)
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

const T = { cream: "#fdf4e4", cream2: "#f6e9d2", ink: "#1a1a1a", ink2: "#4a4540", arancio: "#c93c00" };
const b64 = async (f) => (await readFile(f)).toString("base64");

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

/* --- Copertina --- */
const W = 2400;
const H = 1600;
const DIR = "src/assets/progetti/sisters-store";
// la prima schermata delle due home da telefono (786x1704)
const schermo = async (f) =>
  (await sharp(`${DIR}/${f}`).extract({ left: 0, top: 0, width: 786, height: 1704 }).jpeg({ quality: 92 }).toBuffer()).toString("base64");

const font = {
  display: await b64("src/assets/fonts/fraunces-latin-72-50.woff2"),
  sans: await b64("node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-500-normal.woff2"),
  mono: await b64("node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2"),
};
const prima = await schermo("sisters-prima-home.jpg");
const dopo = await schermo("sisters-dopo-home.jpg");

const telefono = (img, etichetta, extra = "") => `
  <figure class="tel" style="${extra}">
    <figcaption>${etichetta}</figcaption>
    <div class="tel__schermo"><img src="data:image/jpeg;base64,${img}" alt=""></div>
  </figure>`;

await page.setViewportSize({ width: W, height: H });
await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: F; src: url(data:font/woff2;base64,${font.display}) format("woff2"); font-weight: 500 700; }
  @font-face { font-family: H; src: url(data:font/woff2;base64,${font.sans}) format("woff2"); font-weight: 500; }
  @font-face { font-family: M; src: url(data:font/woff2;base64,${font.mono}) format("woff2"); }
  html, body { margin: 0; width: ${W}px; height: ${H}px; background: ${T.cream}; overflow: hidden; }
  .testo { position: absolute; left: 170px; top: 470px; width: 980px; }
  .eyebrow { font: 34px/1.3 M, monospace; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
  h1 { margin: 34px 0 0; font: 700 132px/1.08 F, Georgia, serif; font-variation-settings: "opsz" 72, "SOFT" 50;
       letter-spacing: -0.02em; color: ${T.ink}; text-wrap: balance; }
  p { margin: 44px 0 0; font: 500 46px/1.4 H, sans-serif; color: ${T.ink2}; max-width: 900px; }
  .barra { position: absolute; left: 170px; top: 1290px; width: 240px; height: 16px; border-radius: 8px; background: ${T.arancio}; }
  .tel { position: absolute; top: 230px; margin: 0; width: 500px; }
  .tel figcaption { display: inline-block; margin: 0 0 26px; padding: 8px 22px; border: 3px solid ${T.ink};
       border-radius: 999px; background: ${T.cream}; font: 30px/1.3 M, monospace; letter-spacing: 0.08em;
       text-transform: uppercase; color: ${T.ink}; }
  .tel__schermo { border: 6px solid ${T.ink}; border-radius: 48px; overflow: hidden; background: #fff; }
  .tel__schermo img { display: block; width: 100%; }
</style></head><body>
  <div class="testo">
    <div class="eyebrow">Sisters Store · Shopify</div>
    <h1>I numeri prima, il sito dopo.</h1>
    <p>Il negozio di prima e quello online dall'11 novembre 2026.</p>
  </div>
  <div class="barra"></div>
  ${telefono(prima, "Prima", "left: 1250px;")}
  ${telefono(dopo, "Dopo", "left: 1810px;")}
</body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const copertina = await page.screenshot({ type: "png" });
const info = await sharp(copertina).jpeg({ quality: 86, mozjpeg: true }).toFile(`${DIR}/sisters-copertina.jpg`);
console.log(`ok sisters-copertina.jpg ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);

await browser.close();
