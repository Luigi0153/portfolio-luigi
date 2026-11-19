/*
  Schermate del caso Sisters Store, prima e dopo il sito nuovo.
  - "dopo": sistersstore.it col tema pubblicato;
  - "prima": lo stesso negozio col tema vecchio "Sito Ufficiale" (#203060707671),
    aperto in anteprima. Il tema è quello vecchio, i prodotti sono quelli di oggi.
  Il banner dei cookie si chiude con "Declina", la barra dell'anteprima si nasconde.
  Stessa scheda prodotto e stessa collezione per tutti e due i temi.

  Uscita in src/assets/progetti/sisters-store/catture/ (poi scripts/prepara-sisters.mjs le mette
  nelle cornici e scrive le immagini della pagina in src/assets/progetti/sisters-store/):
    sisters-<prima|dopo>-home-desktop.jpg   1440x900, prima schermata
    sisters-<prima|dopo>-home.jpg           telefono 393, 2x, la parte alta della pagina
    sisters-<prima|dopo>-scheda.jpg         telefono 393, 2x, prima schermata (slider)
    sisters-<prima|dopo>-collezione.jpg     telefono 393, 2x, la parte alta della pagina
    sisters-<prima|dopo>-filtri.jpg         telefono 393, 2x, pannello dei filtri aperto

  Uso: node scripts/cattura-sisters.mjs [handle-prodotto]
*/
import { chromium, devices } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SITO = "https://sistersstore.it";
const TEMA_VECCHIO = "203060707671";
const DIR = "src/assets/progetti/sisters-store/catture";
const COLLEZIONE = "/collections/borse";
// Altezza massima delle schermate lunghe da telefono, in pixel CSS
const MAX_ALTEZZA = 1900;

const NASCONDI = `
  #preview-bar-iframe, #PBarNextFrameWrapper, #PBarNextFrame,
  iframe[src*="preview_bar"], [id^="preview-bar"] { display: none !important; }
  html { scroll-behavior: auto !important; }
`;

await mkdir(DIR, { recursive: true });

/** Una scheda: il primo prodotto disponibile e scontato della collezione. */
async function scegliProdotto() {
  if (process.argv[2]) return process.argv[2];
  const res = await fetch(`${SITO}${COLLEZIONE}/products.json?limit=30`);
  const { products } = await res.json();
  const p = products.find(
    (p) => p.variants.some((v) => v.available) && p.variants.some((v) => Number(v.compare_at_price) > Number(v.price)),
  );
  if (!p) throw new Error("nessun prodotto disponibile e scontato in " + COLLEZIONE);
  return p.handle;
}

const url = (percorso, tema) => {
  const u = new URL(SITO + percorso);
  if (tema) u.searchParams.set("preview_theme_id", tema);
  return u.toString();
};

async function prepara(page) {
  await page.addStyleTag({ content: NASCONDI });
  const declina = page.getByRole("button", { name: /^declina$/i });
  if (await declina.isVisible().catch(() => false)) {
    await declina.click();
    await page.waitForTimeout(600);
  }
  // scorre fino in fondo per caricare le foto lazy e far partire le entrate, poi torna su
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
}

async function salva(buffer, nome) {
  const file = path.join(DIR, nome);
  const info = await sharp(buffer).jpeg({ quality: 85, mozjpeg: true }).toFile(file);
  console.log(`ok ${nome} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
}

const handle = await scegliProdotto();
console.log("prodotto:", handle);

const browser = await chromium.launch();

for (const [stato, tema] of [["prima", TEMA_VECCHIO], ["dopo", ""]]) {
  /* --- Desktop: la prima schermata della home --- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(url("/", tema), { waitUntil: "networkidle", timeout: 90000 });
    await prepara(page);
    await salva(await page.screenshot(), `sisters-${stato}-home-desktop.jpg`);
    await ctx.close();
  }

  /* --- Telefono --- */
  const ctx = await browser.newContext({
    ...devices["iPhone 13"],
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  const lunga = async (percorso, nome) => {
    await page.goto(url(percorso, tema), { waitUntil: "networkidle", timeout: 90000 });
    await prepara(page);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const clip = { x: 0, y: 0, width: 393, height: Math.min(h, MAX_ALTEZZA) };
    await salva(await page.screenshot({ fullPage: true, clip }), nome);
  };

  await lunga("/", `sisters-${stato}-home.jpg`);

  await page.goto(url(`/products/${handle}`, tema), { waitUntil: "networkidle", timeout: 90000 });
  await prepara(page);
  await salva(await page.screenshot(), `sisters-${stato}-scheda.jpg`);

  await lunga(COLLEZIONE, `sisters-${stato}-collezione.jpg`);

  // pannello dei filtri (Dawn: il summary di "Filtra e ordina")
  const apri = page.locator(".mobile-facets__open").first();
  if (await apri.isVisible().catch(() => false)) {
    await apri.click();
    await page.waitForTimeout(1200);
    await salva(await page.screenshot(), `sisters-${stato}-filtri.jpg`);
  } else {
    console.log(`!! ${stato}: nessun bottone dei filtri visibile`);
  }

  await ctx.close();
}

await browser.close();
