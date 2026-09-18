/*
  Screenshot di verifica a 390px e 1280px per entrambi i target (dev/business).
  Uso: node scripts/screenshot.mjs [percorso]   (default "/")
  Richiede il server attivo (npm run preview) su BASE_URL o localhost:4321.
  Output in screenshots/ (ignorata da git).
*/
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const percorso = process.argv[2] ?? "/";
const slug =
  percorso === "/" ? "home" : percorso.replace(/\W+/g, "-").replace(/^-|-$/g, "");

const targets = ["dev", "business"];
const viewports = [
  { nome: "390", width: 390, height: 844 },
  { nome: "1280", width: 1280, height: 800 },
];

await mkdir("screenshots", { recursive: true });
const browser = await chromium.launch();

for (const target of targets) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    await context.addInitScript((t) => {
      try {
        localStorage.setItem("target", t);
      } catch {}
    }, target);

    const page = await context.newPage();
    await page.goto(BASE + percorso, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800); // lascia finire le animazioni d'entrata

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    if (overflow) {
      console.warn(`⚠ overflow orizzontale: ${percorso} target=${target} @${vp.nome}`);
    }

    const file = `screenshots/${slug}-${target}-${vp.nome}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log("✓", file);
    await context.close();
  }
}

await browser.close();
